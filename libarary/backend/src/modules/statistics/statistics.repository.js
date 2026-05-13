const { prisma } = require('../../config/database');

const borrowInclude = {
  reader: {
    select: {
      id: true,
      readerNo: true,
      name: true,
      status: true
    }
  },
  book: {
    select: {
      id: true,
      isbn: true,
      title: true,
      author: true,
      status: true,
      availableCopies: true
    }
  },
  borrowOperator: {
    select: {
      id: true,
      username: true,
      fullName: true
    }
  },
  returnOperator: {
    select: {
      id: true,
      username: true,
      fullName: true
    }
  }
};

const bookInclude = {
  category: {
    select: {
      id: true,
      name: true
    }
  },
  publisher: {
    select: {
      id: true,
      name: true
    }
  }
};

function buildBorrowWhere(params = {}) {
  const { startDate, endDate, readerId, bookId, status, keyword } = params;
  const andClauses = [];

  if (startDate) {
    andClauses.push({ borrowDate: { gte: startDate } });
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    andClauses.push({ borrowDate: { lte: end } });
  }

  if (readerId) {
    andClauses.push({ readerId: Number(readerId) });
  }

  if (bookId) {
    andClauses.push({ bookId: Number(bookId) });
  }

  if (status && status !== 'ALL') {
    andClauses.push({ status });
  }

  if (keyword) {
    andClauses.push({
      OR: [
        { borrowNo: { contains: keyword } },
        { reader: { name: { contains: keyword } } },
        { reader: { readerNo: { contains: keyword } } },
        { book: { title: { contains: keyword } } },
        { book: { isbn: { contains: keyword } } }
      ]
    });
  }

  return andClauses.length > 0 ? { AND: andClauses } : {};
}

function buildInventoryWhere(params = {}) {
  const { status, keyword, categoryId } = params;
  const andClauses = [];

  if (status && status !== 'ALL') {
    andClauses.push({ status });
  }

  if (keyword) {
    andClauses.push({
      OR: [
        { title: { contains: keyword } },
        { author: { contains: keyword } },
        { isbn: { contains: keyword } }
      ]
    });
  }

  if (categoryId) {
    andClauses.push({ categoryId: Number(categoryId) });
  }

  return andClauses.length > 0 ? { AND: andClauses } : {};
}

const statisticsRepository = {
  async getBorrowRecords(params = {}) {
    const { page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const where = buildBorrowWhere(params);

    const [items, total] = await Promise.all([
      prisma.borrowRecord.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { borrowDate: 'desc' },
        include: borrowInclude
      }),
      prisma.borrowRecord.count({ where })
    ]);

    return { items, total };
  },

  async getDailyBorrowTrend(days, startDate, endDate) {
    const start = startDate || new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();
    end.setHours(23, 59, 59, 999);

    const records = await prisma.borrowRecord.groupBy({
      by: ['borrowDate'],
      where: {
        borrowDate: {
          gte: start,
          lte: end
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        borrowDate: 'asc'
      }
    });

    return records.map(item => ({
      date: item.borrowDate.toISOString().split('T')[0],
      count: item._count.id
    }));
  },

  async getMonthlyBorrowTrend(startDate, endDate) {
    const start = startDate || new Date();
    start.setMonth(start.getMonth() - 12);
    const end = endDate || new Date();
    end.setHours(23, 59, 59, 999);

    const records = await prisma.borrowRecord.findMany({
      where: {
        borrowDate: {
          gte: start,
          lte: end
        }
      },
      select: {
        borrowDate: true
      },
      orderBy: {
        borrowDate: 'asc'
      }
    });

    const monthlyMap = {};
    records.forEach(record => {
      const month = record.borrowDate.toISOString().slice(0, 7);
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });

    return Object.entries(monthlyMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  async getPopularBooks(params = {}) {
    const { days = 30, startDate, endDate, limit = 10 } = params;
    const start = startDate || new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();
    end.setHours(23, 59, 59, 999);

    const records = await prisma.borrowRecord.groupBy({
      by: ['bookId'],
      where: {
        borrowDate: {
          gte: start,
          lte: end
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: limit
    });

    if (records.length === 0) {
      return [];
    }

    const bookIds = records.map(r => r.bookId);
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } },
      include: bookInclude
    });

    const bookMap = {};
    books.forEach(book => {
      bookMap[book.id] = book;
    });

    return records.map((record, index) => ({
      rank: index + 1,
      borrowCount: record._count.id,
      book: bookMap[record.bookId] || null
    }));
  },

  async getInventory(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const where = buildInventoryWhere(params);

    const [items, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
        include: bookInclude
      }),
      prisma.book.count({ where })
    ]);

    return { items, total };
  },

  async getInventorySummary() {
    const [totalBooks, totalCopies, availableCopies, offShelfBooks, totalCategories] = await Promise.all([
      prisma.book.count({ where: { status: { notIn: ['OFF_SHELF'] } } }),
      prisma.book.aggregate({
        _sum: { totalCopies: true }
      }),
      prisma.book.aggregate({
        _sum: { availableCopies: true }
      }),
      prisma.book.count({ where: { status: 'OFF_SHELF' } }),
      prisma.category.count()
    ]);

    return {
      totalBooks,
      totalCopies: totalCopies._sum.totalCopies || 0,
      availableCopies: availableCopies._sum.availableCopies || 0,
      borrowedCopies: (totalCopies._sum.totalCopies || 0) - (availableCopies._sum.availableCopies || 0),
      offShelfBooks,
      totalCategories
    };
  }
};

module.exports = statisticsRepository;
