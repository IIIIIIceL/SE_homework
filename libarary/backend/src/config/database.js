const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['warn', 'error']
});

async function checkDatabaseConnection() {
  await prisma.$queryRaw`SELECT 1`;
  return true;
}

module.exports = {
  prisma,
  checkDatabaseConnection
};
