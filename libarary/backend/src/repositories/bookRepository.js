const { prisma } = require('../config/database');

const bookRepository = {
  create(data) {
    return prisma.book.create({ data });
  },

  findById(id) {
    return prisma.book.findUnique({
      where: { id },
      include: { category: true, publisher: true }
    });
  },

  findByIsbn(isbn) {
    return prisma.book.findUnique({ where: { isbn } });
  },

  listAvailable(params = {}) {
    const { page = 1, pageSize = 10, keyword } = params;
    const skip = (page - 1) * pageSize;
    const where = {
      status: 'AVAILABLE',
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword } },
              { author: { contains: keyword } },
              { isbn: { contains: keyword } }
            ]
          }
        : {})
    };

    return prisma.book.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });
  }
};

module.exports = bookRepository;
