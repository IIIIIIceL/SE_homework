const { prisma } = require('../config/database');

const readerRepository = {
  async create(data) {
    return prisma.reader.create({ data });
  },

  findById(id) {
    return prisma.reader.findUnique({ where: { id } });
  },

  findByReaderNo(readerNo) {
    return prisma.reader.findUnique({ where: { readerNo } });
  },

  findByIdNumber(idNumber) {
    return prisma.reader.findUnique({ where: { idNumber } });
  },

  async update(id, data) {
    return prisma.reader.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.reader.delete({ where: { id } });
  },

  async list(params = {}) {
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

    const [items, total] = await Promise.all([
      prisma.reader.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.reader.count({ where })
    ]);

    return { rows: items, count: total };
  }
};

module.exports = readerRepository;
