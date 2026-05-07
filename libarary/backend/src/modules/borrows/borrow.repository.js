const { prisma } = require('../../config/database');

const borrowInclude = {
  reader: {
    select: {
      id: true,
      readerNo: true,
      name: true,
      status: true,
      maxBorrowCount: true
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

function buildWhere(params = {}) {
  const { readerId, bookId, status, keyword, overdueOnly } = params;
  const andClauses = [];

  if (readerId) {
    andClauses.push({ readerId: Number(readerId) });
  }

  if (bookId) {
    andClauses.push({ bookId: Number(bookId) });
  }

  if (status && status !== 'ALL') {
    if (status === 'ACTIVE') {
      andClauses.push({ status: { in: ['BORROWED', 'OVERDUE'] } });
    } else {
      andClauses.push({ status });
    }
  }

  if (overdueOnly) {
    andClauses.push({
      AND: [
        { status: { in: ['BORROWED', 'OVERDUE'] } },
        { dueDate: { lt: new Date() } }
      ]
    });
  }

  if (keyword && String(keyword).trim()) {
    const search = String(keyword).trim();
    andClauses.push({
      OR: [
        { borrowNo: { contains: search } },
        { reader: { name: { contains: search } } },
        { reader: { readerNo: { contains: search } } },
        { book: { title: { contains: search } } },
        { book: { isbn: { contains: search } } }
      ]
    });
  }

  if (andClauses.length === 0) {
    return {};
  }

  return { AND: andClauses };
}

const borrowRepository = {
  create(data) {
    return prisma.borrowRecord.create({
      data,
      include: borrowInclude
    });
  },

  findById(id) {
    return prisma.borrowRecord.findUnique({
      where: { id },
      include: borrowInclude
    });
  },

  findByBorrowNo(borrowNo) {
    return prisma.borrowRecord.findUnique({
      where: { borrowNo },
      include: borrowInclude
    });
  },

  list(params = {}) {
    const { page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const where = buildWhere(params);

    return prisma.borrowRecord.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { borrowDate: 'desc' },
      include: borrowInclude
    });
  },

  count(params = {}) {
    return prisma.borrowRecord.count({ where: buildWhere(params) });
  },

  update(id, data) {
    return prisma.borrowRecord.update({
      where: { id },
      data,
      include: borrowInclude
    });
  },

  // 获取读者的当前借出数量（未归还的记录）
  getReaderBorrowCount(readerId) {
    return prisma.borrowRecord.count({
      where: {
        readerId,
        status: { in: ['BORROWED', 'OVERDUE'] }
      }
    });
  },

  // 获取读者的超期记录
  getReaderOverdueRecords(readerId) {
    return prisma.borrowRecord.findMany({
      where: {
        readerId,
        status: { in: ['BORROWED', 'OVERDUE'] },
        dueDate: { lt: new Date() }
      },
      include: borrowInclude
    });
  },

  // 获取所有超期记录
  getOverdueRecords(params = {}) {
    const { page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;

    return prisma.borrowRecord.findMany({
      where: {
        status: { in: ['BORROWED', 'OVERDUE'] },
        dueDate: { lt: new Date() }
      },
      skip,
      take: pageSize,
      orderBy: { dueDate: 'asc' },
      include: borrowInclude
    });
  },

  countOverdue() {
    return prisma.borrowRecord.count({
      where: {
        status: { in: ['BORROWED', 'OVERDUE'] },
        dueDate: { lt: new Date() }
      }
    });
  }
};

module.exports = borrowRepository;
