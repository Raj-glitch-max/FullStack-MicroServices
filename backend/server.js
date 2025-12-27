const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const cors = require('cors');
const client = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

// --- Prometheus metrics ---
// Collect default Node.js metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({
  prefix: 'app_',
});

const httpRequestDuration = new client.Histogram({
  name: 'app_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

const dependencyUp = new client.Gauge({
  name: 'app_dependency_up',
  help: 'Dependency health (1=up, 0=down)',
  labelNames: ['dependency'],
});

// Simple request timing middleware
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const deltaNs = process.hrtime.bigint() - start;
    const seconds = Number(deltaNs) / 1e9;

    // Keep cardinality low by grouping /api/users/:id into /api/users/:id.
    const route = (req.route && req.route.path) ? req.route.path : req.path;
    httpRequestDuration
      .labels(req.method, route, String(res.statusCode))
      .observe(seconds);
  });
  next();
});

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'admin',
  password: process.env.DATABASE_PASSWORD || 'secret123',
  database: process.env.DATABASE_NAME || 'myapp',
  port: 5432,
});

// Redis connection
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379
  }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

// Initialize database
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database init error:', err);
  }
}

initDB();

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redisClient.ping();
    dependencyUp.labels('postgres').set(1);
    dependencyUp.labels('redis').set(1);
    res.json({ status: 'healthy', database: 'connected', cache: 'connected' });
  } catch (err) {
    // Best-effort: mark deps down (we don't know which one failed without parsing)
    dependencyUp.labels('postgres').set(0);
    dependencyUp.labels('redis').set(0);
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Prometheus scrape endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    // Check cache first
    const cached = await redisClient.get('users');
    if (cached) {
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }

    // Query database
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    
    // Cache result (30 seconds)
    await redisClient.setEx('users', 30, JSON.stringify(result.rows));
    
    res.json({ source: 'database', data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    
    // Invalidate cache
    await redisClient.del('users');
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    // Invalidate cache
    await redisClient.del('users');
    
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});