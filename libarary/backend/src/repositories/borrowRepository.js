const { prisma } = require('../config/database');

function buildBorrowNo() {
  return `BR${Date.now()}`;
}

const borrowRepository = {
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
