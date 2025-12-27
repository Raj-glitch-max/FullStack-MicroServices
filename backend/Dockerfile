FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN if [ -s package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
COPY . .

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', res => {  process.exit(res.statusCode === 200 ? 0 : 1); });"

EXPOSE 3000

CMD ["npm", "start"]