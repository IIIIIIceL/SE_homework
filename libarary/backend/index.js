const express = require('express');
const { prisma, checkDatabaseConnection } = require('./src/config/database');
const { registerModules } = require('./src/modules');
const errorHandler = require('./src/common/middleware/errorHandler');
const app = express();
const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim());
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

//数据库健康检测接口
app.get('/api/health/db', async (req, res) => {
  try {
    await checkDatabaseConnection();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
  }
});

registerModules(app);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
