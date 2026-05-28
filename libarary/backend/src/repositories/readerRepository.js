const { prisma } = require('../config/database');

function buildWhere(params = {}) {
  const { keyword, status } = params;
  const andClauses = [];

  if (status && status !== 'ALL') {
    andClauses.push({ status });
  }

  if (keyword && String(keyword).trim()) {
    const search = String(keyword).trim();
    andClauses.push({
      OR: [
        { readerNo: { contains: search } },
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { department: { contains: search } },
        { className: { contains: search } }
      ]
    });
  }

  return andClauses.length ? { AND: andClauses } : {};
}

const readerRepository = {
  create(data) {
    return prisma.reader.create({ data });
  },

  findById(id) {
    return prisma.reader.findUnique({ where: { id } });
  },

  findByReaderNo(readerNo) {
    return prisma.reader.findUnique({ where: { readerNo } });
  },

  update(id, data) {
    return prisma.reader.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.reader.delete({ where: { id } });
  },

  async list(params = {}) {
    const { page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const where = buildWhere(params);

    const [rows, total] = await Promise.all([
      prisma.reader.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.reader.count({ where })
    ]);

    return { rows, total };
  }
};

module.exports = readerRepository;
