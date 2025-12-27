import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [health, setHealth] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // Check backend health
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Health check failed:', err));
  }, []);

  // Fetch users
  const fetchUsers = () => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.data);
        setSource(data.source);
      })
      .catch(err => console.error('Fetch failed:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const addUser = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    })
      .then(() => {
        setName('');
        setEmail('');
        fetchUsers();
      })
      .catch(err => console.error('Add failed:', err));
  };

  // Delete user
  const deleteUser = (id) => {
    fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' })
      .then(() => fetchUsers())
      .catch(err => console.error('Delete failed:', err));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Microservices App</h1>
      
      {/* Health Status */}
      <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
        <h3>System Health</h3>
        {health ? (
          <div>
            <p>Status: <strong style={{color: 'green'}}>{health.status}</strong></p>
            <p>Database: {health.database}</p>
            <p>Cache: {health.cache}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Add User Form */}
      <div style={{ background: '#e3f2fd', padding: '20px', marginBottom: '20px' }}>
        <h3>Add New User</h3>
        <form onSubmit={addUser}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '8px 20px' }}>Add User</button>
        </form>
      </div>

      {/* Users List */}
      <div>
        <h3>Users (Source: {source})</h3>
        <button onClick={fetchUsers} style={{ marginBottom: '10px' }}>Refresh</button>
        {users.length === 0 ? (
          <p>No users yet. Add one above!</p>
        ) : (
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Created</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ padding: '10px' }}>{user.id}</td>
                  <td style={{ padding: '10px' }}>{user.name}</td>
                  <td style={{ padding: '10px' }}>{user.email}</td>
                  <td style={{ padding: '10px' }}>{new Date(user.created_at).toLocaleString()}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;