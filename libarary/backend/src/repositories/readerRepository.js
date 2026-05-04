const { prisma } = require('../config/database');

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

  list(params = {}) {
    const { page = 1, pageSize = 10, keyword } = params;
    const skip = (page - 1) * pageSize;
    const where = keyword
      ? {
          OR: [
            { readerNo: { contains: keyword } },
            { name: { contains: keyword } },
            { phone: { contains: keyword } }
          ]
        }
      : {};

    return prisma.reader.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });
  }
};

module.exports = readerRepository;
