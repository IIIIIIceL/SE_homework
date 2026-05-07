const { prisma } = require('../../config/database');

const bookInclude = {
  category: {
    select: {
      id: true,
      name: true,
      parentId: true
    }
  },
  publisher: {
    select: {
      id: true,
      name: true
    }
  }
};

function buildWhere(params = {}) {
  const { keyword, status, title, author, isbn, category } = params;
  const andClauses = [];

  if (status && status !== 'ALL') {
    andClauses.push({ status });
  }

  if (keyword && String(keyword).trim()) {
    const search = String(keyword).trim();
    andClauses.push({
      OR: [
        { title: { contains: search } },
        { author: { contains: search } },
        { isbn: { contains: search } },
        { keywords: { contains: search } }
      ]
    });
  }

  if (title) {
    andClauses.push({ title: { contains: title } });
  }

  if (author) {
    andClauses.push({ author: { contains: author } });
  }

  if (isbn) {
    andClauses.push({ isbn: { contains: isbn } });
  }

  if (category) {
    andClauses.push({
      category: {
        is: {
          name: { contains: category }
        }
      }
    });
  }

  if (andClauses.length === 0) {
    return {};
  }

  return { AND: andClauses };
}

const bookRepository = {
  create(data) {
    return prisma.book.create({
      data,
      include: bookInclude
    });
  },

  findById(id) {
    return prisma.book.findUnique({
      where: { id },
      include: bookInclude
    });
  },

  findByIsbn(isbn) {
    return prisma.book.findUnique({
      where: { isbn },
      include: bookInclude
    });
  },

  list(params = {}) {
    const { page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const where = buildWhere(params);

    return prisma.book.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: bookInclude
    });
  },

  count(params = {}) {
    return prisma.book.count({ where: buildWhere(params) });
  },

  search(params = {}) {
    const { page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const where = buildWhere(params);

    return prisma.book.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: bookInclude
    });
  },

  update(id, data) {
    return prisma.book.update({
      where: { id },
      data,
      include: bookInclude
    });
  },

  remove(id) {
    return prisma.book.update({
      where: { id },
      data: { status: 'OFF_SHELF' },
      include: bookInclude
    });
  },

  setStatus(id, status) {
    return prisma.book.update({
      where: { id },
      data: { status },
      include: bookInclude
    });
  }
};

module.exports = bookRepository;