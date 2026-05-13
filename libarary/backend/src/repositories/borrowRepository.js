const { prisma } = require('../config/database');

function buildBorrowNo() {
  return `BR${Date.now()}`;
}

const borrowRepository = {
  /**
   * 查询借阅记录列表
   * @param {Object} filters - 查询条件
   * @param {string} filters.startDate - 开始日期（借书时间）
   * @param {string} filters.endDate - 结束日期（借书时间）
   * @param {number} filters.readerId - 读者 ID
   * @param {number} filters.bookId - 图书 ID
   * @param {string} filters.status - 借阅状态
   * @param {number} filters.page - 页码
   * @param {number} filters.pageSize - 每页数量
   */
  async findBorrowRecords(filters = {}) {
    const {
      startDate,
      endDate,
      readerId,
      bookId,
      status,
      page = 1,
      pageSize = 10
    } = filters;

    const where = {};

    // 时间范围过滤
    if (startDate || endDate) {
      where.borrowDate = {};
      if (startDate) {
        where.borrowDate.gte = new Date(startDate);
      }
      if (endDate) {
        // 包含结束日期的全天
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.borrowDate.lte = end;
      }
    }

    // 读者 ID 过滤
    if (readerId) {
      where.readerId = readerId;
    }

    // 图书 ID 过滤
    if (bookId) {
      where.bookId = bookId;
    }

    // 状态过滤
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize, 10);

    const [records, total] = await Promise.all([
      prisma.borrowRecord.findMany({
        where,
        skip,
        take,
        include: {
          reader: true,
          book: {
            include: {
              category: true,
              publisher: true
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
        },
        orderBy: {
          borrowDate: 'desc'
        }
      }),
      prisma.borrowRecord.count({ where })
    ]);

    return {
      data: records,
      total,
      page,
      pageSize
    };
  },

  /**
   * 根据 ID 获取借阅记录详情
   */
  async findBorrowRecordById(id) {
    return prisma.borrowRecord.findUnique({
      where: { id },
      include: {
        reader: true,
        book: {
          include: {
            category: true,
            publisher: true
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
      }
    });
  },

  async borrowBook({ readerId, bookId, dueDate, operatorBorrowId, remark }) {
    return prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book) {
        throw new Error('图书不存在');
      }
      if (book.availableCopies <= 0 || book.status !== 'AVAILABLE') {
        throw new Error('图书不可借');
      }

      const activeBorrowCount = await tx.borrowRecord.count({
        where: {
          readerId,
          status: { in: ['BORROWED', 'OVERDUE'] }
        }
      });

      const reader = await tx.reader.findUnique({ where: { id: readerId } });
      if (!reader) {
        throw new Error('读者不存在');
      }
      if (reader.status !== 'ACTIVE') {
        throw new Error('读者状态不可借阅');
      }
      if (activeBorrowCount >= reader.maxBorrowCount) {
        throw new Error('已达最大借阅数量');
      }

      const borrowRecord = await tx.borrowRecord.create({
        data: {
          borrowNo: buildBorrowNo(),
          readerId,
          bookId,
          dueDate,
          operatorBorrowId,
          remark
        }
      });

      await tx.book.update({
        where: { id: bookId },
        data: {
          availableCopies: { decrement: 1 }
        }
      });

      return borrowRecord;
    });
  },

  async returnBook({ borrowRecordId, operatorReturnId, fineAmount = 0, remark }) {
    return prisma.$transaction(async (tx) => {
      const record = await tx.borrowRecord.findUnique({ where: { id: borrowRecordId } });
      if (!record) {
        throw new Error('借阅记录不存在');
      }
      if (!['BORROWED', 'OVERDUE'].includes(record.status)) {
        throw new Error('当前借阅记录不可归还');
      }

      const updatedRecord = await tx.borrowRecord.update({
        where: { id: borrowRecordId },
        data: {
          status: 'RETURNED',
          returnDate: new Date(),
          operatorReturnId,
          fineAmount,
          remark
        }
      });

      await tx.book.update({
        where: { id: record.bookId },
        data: {
          availableCopies: { increment: 1 }
        }
      });

      return updatedRecord;
    });
  }
};

module.exports = borrowRepository;
