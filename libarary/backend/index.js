const express = require('express');
const { prisma, checkDatabaseConnection } = require('./src/config/database');
const bookRoutes = require('./src/modules/books');
const app = express();
const port = process.env.PORT || 3001;
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

app.use('/api/books', bookRoutes);

app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
