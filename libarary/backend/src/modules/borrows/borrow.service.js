const { prisma } = require('../../config/database');
const borrowRepository = require('./borrow.repository');
const { operationLogRepository } = require('../system/system.repository');
const {
  normalizeBorrowInput,
  normalizeReturnInput,
  normalizeRenewInput,
  normalizeBorrowQuery
} = require('./dto/borrow.dto');
const { toBorrowListVO, toBorrowVO } = require('./vo/borrow.vo');

const BORROW_STATUSES = new Set(['BORROWED', 'RETURNED', 'OVERDUE', 'LOST']);
const READER_STATUSES = new Set(['ACTIVE', 'SUSPENDED', 'CANCELLED']);
const BOOK_STATUSES = new Set(['AVAILABLE', 'OFF_SHELF']);
const MAX_RENEW_COUNT = 3; // 最多续期次数

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

async function logBorrowAction(payload) {
  try {
    await operationLogRepository.create(payload);
  } catch (error) {
    // 操作日志失败不应影响主业务流程
    console.warn('[borrow-log] 操作日志记录失败:', error.message);
  }
}

/**
 * 生成借阅号
 * 格式: BOR + 时间戳 + 随机数
 */
function generateBorrowNo() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BOR${timestamp}${random}`;
}

/**
 * 计算罚款（每天0.5元）
 */
function calculateFine(dueDate) {
  const now = new Date();
  if (now <= dueDate) {
    return 0;
  }

  const overdueDays = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
  return overdueDays * 0.5;
}

/**
 * 验证读者是否可以借阅
 */
async function validateReaderCanBorrow(readerId) {
  const reader = await prisma.reader.findUnique({
    where: { id: readerId },
    include: {
      borrowRecords: {
        where: {
          status: { in: ['BORROWED', 'OVERDUE'] }
        }
      }
    }
  });

  if (!reader) {
    throw createError('READER_NOT_FOUND', '读者不存在');
  }

  if (reader.status !== 'ACTIVE') {
    throw createError('READER_NOT_ACTIVE', `读者状态为 ${reader.status}，不能借阅图书`);
  }

  if (reader.borrowRecords.length >= reader.maxBorrowCount) {
    throw createError('MAX_BORROW_EXCEEDED', `达到借阅上限 ${reader.maxBorrowCount} 本`);
  }

  return reader;
}

/**
 * 验证图书是否可以借阅
 */
async function validateBookCanBorrow(bookId) {
  const book = await prisma.book.findUnique({
    where: { id: bookId }
  });

  if (!book) {
    throw createError('BOOK_NOT_FOUND', '图书不存在');
  }

  if (book.status !== 'AVAILABLE') {
    throw createError('BOOK_NOT_AVAILABLE', '图书不可借阅');
  }

  if (book.availableCopies <= 0) {
    throw createError('NO_AVAILABLE_COPY', '图书暂无可用副本');
  }

  return book;
}

/**
 * 借出图书
 */
async function borrowBook(data, operatorId) {
  const input = normalizeBorrowInput(data);

  if (!input.readerId || !input.bookId || !input.dueDate) {
    throw createError('MISSING_FIELDS', '缺少必要字段: readerId, bookId, dueDate');
  }

  // 验证读者
  const reader = await validateReaderCanBorrow(input.readerId);

  // 验证图书
  const book = await validateBookCanBorrow(input.bookId);

  // 检查该读者是否已借阅该图书（防止重复借阅）
  const existingBorrow = await prisma.borrowRecord.findFirst({
    where: {
      readerId: input.readerId,
      bookId: input.bookId,
      status: { in: ['BORROWED', 'OVERDUE'] }
    }
  });

  if (existingBorrow) {
    throw createError('DUPLICATE_BORROW', '该读者已借阅此图书');
  }

  // 事务：创建借阅记录 + 更新图书副本数
  const borrowRecord = await prisma.$transaction(async (tx) => {
    // 创建借阅记录
    const newRecord = await tx.borrowRecord.create({
      data: {
        borrowNo: generateBorrowNo(),
        readerId: input.readerId,
        bookId: input.bookId,
        dueDate: input.dueDate,
        operatorBorrowId: operatorId || null,
        status: 'BORROWED',
        remark: input.remark
      },
      include: {
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
        returnOperator: true
      }
    });

    // 更新图书副本数
    await tx.book.update({
      where: { id: input.bookId },
      data: { availableCopies: { decrement: 1 } }
    });

    return newRecord;
  });

  await logBorrowAction({
    userId: operatorId || null,
    action: 'BORROW_BOOK',
    targetType: 'BorrowRecord',
    targetId: String(borrowRecord.id),
    detail: `读者 ${reader.name} 借阅图书 ${book.title}`
  });

  return borrowRecord;
}

/**
 * 归还图书
 */
async function returnBook(borrowId, data, operatorId) {
  const id = Number(borrowId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '借阅记录编号不合法');
  }

  const input = normalizeReturnInput(data);

  // 查询借阅记录
  const borrow = await borrowRepository.findById(id);
  if (!borrow) {
    throw createError('BORROW_NOT_FOUND', '借阅记录不存在');
  }

  if (borrow.status === 'RETURNED') {
    throw createError('ALREADY_RETURNED', '图书已归还');
  }

  if (borrow.status === 'LOST') {
    throw createError('BOOK_LOST', '图书已遗失，不能归还');
  }

  // 计算罚款
  const calculatedFine = calculateFine(borrow.dueDate);
  const fineAmount = input.fineAmount >= 0 ? input.fineAmount : calculatedFine;

  // 更新借阅记录状态
  let newStatus = 'RETURNED';
  if (calculatedFine > 0) {
    newStatus = 'OVERDUE'; // 如果超期则标记为超期（已归还但超期）
  }

  // 事务：更新借阅记录 + 恢复图书副本数
  const returnRecord = await prisma.$transaction(async (tx) => {
    const updated = await tx.borrowRecord.update({
      where: { id },
      data: {
        status: newStatus,
        returnDate: new Date(),
        operatorReturnId: operatorId || null,
        fineAmount,
        remark: input.remark
      },
      include: {
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
      }
    });

    // 恢复图书副本数
    await tx.book.update({
      where: { id: borrow.bookId },
      data: { availableCopies: { increment: 1 } }
    });

    return updated;
  });

  await logBorrowAction({
    userId: operatorId || null,
    action: 'RETURN_BOOK',
    targetType: 'BorrowRecord',
    targetId: String(returnRecord.id),
    detail: `读者 ${borrow.reader.name} 归还图书 ${borrow.book.title}，罚款 ${fineAmount}`
  });

  return returnRecord;
}

/**
 * 续期
 */
async function renewBook(borrowId, data) {
  const id = Number(borrowId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '借阅记录编号不合法');
  }

  const input = normalizeRenewInput(data);

  if (!input.newDueDate) {
    throw createError('MISSING_FIELDS', '缺少新到期日期');
  }

  const borrow = await borrowRepository.findById(id);
  if (!borrow) {
    throw createError('BORROW_NOT_FOUND', '借阅记录不存在');
  }

  if (borrow.status === 'RETURNED') {
    throw createError('ALREADY_RETURNED', '图书已归还，不能续期');
  }

  if (borrow.status === 'LOST') {
    throw createError('BOOK_LOST', '图书已遗失，不能续期');
  }

  if (borrow.renewCount >= MAX_RENEW_COUNT) {
    throw createError('MAX_RENEW_EXCEEDED', `续期次数已达上限 ${MAX_RENEW_COUNT} 次`);
  }

  const renewedRecord = await prisma.borrowRecord.update({
    where: { id },
    data: {
      dueDate: input.newDueDate,
      renewCount: { increment: 1 },
      remark: input.remark
    },
    include: {
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
    }
  });

  return renewedRecord;
}

/**
 * 获取借阅列表
 */
async function listBorrows(query) {
  const params = normalizeBorrowQuery(query);
  const [items, total] = await Promise.all([
    borrowRepository.list(params),
    borrowRepository.count(params)
  ]);

  return {
    data: toBorrowListVO(items),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

/**
 * 获取单条借阅记录
 */
async function getBorrow(borrowId) {
  const id = Number(borrowId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '借阅记录编号不合法');
  }

  const record = await borrowRepository.findById(id);
  if (!record) {
    throw createError('BORROW_NOT_FOUND', '借阅记录不存在');
  }

  return toBorrowVO(record);
}

/**
 * 获取超期记录
 */
async function getOverdueRecords(query) {
  const params = normalizeBorrowQuery(query);
  const [items, total] = await Promise.all([
    borrowRepository.getOverdueRecords(params),
    borrowRepository.countOverdue()
  ]);

  // 通知能力预留：后续可在这里接入短信/邮件/站内信超期提醒
  // 例如：await notificationService.sendOverdueReminders(items)

  return {
    data: toBorrowListVO(items),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

/**
 * 获取读者当前借出数量
 */
async function getReaderBorrowCount(readerId) {
  const count = await borrowRepository.getReaderBorrowCount(readerId);
  return count;
}

module.exports = {
  borrowBook,
  returnBook,
  renewBook,
  listBorrows,
  getBorrow,
  getOverdueRecords,
  getReaderBorrowCount
};
