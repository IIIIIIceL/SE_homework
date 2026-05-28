const {
  borrowBook,
  returnBook,
  renewBook,
  listBorrows,
  listBorrowsForReader,
  getBorrow,
  getBorrowForReader,
  getOverdueRecords
} = require('./borrow.service');
const readerService = require('../readers/reader.service');

function handleError(res, error) {
  const message = error && error.message ? error.message : '服务异常';

  switch (error && error.code) {
    case 'INVALID_ID':
      return res.status(400).json({ message });
    case 'MISSING_FIELDS':
    case 'READER_NOT_FOUND':
    case 'READER_NOT_ACTIVE':
    case 'BOOK_NOT_FOUND':
    case 'BOOK_NOT_AVAILABLE':
    case 'NO_AVAILABLE_COPY':
    case 'DUPLICATE_BORROW':
    case 'ALREADY_RETURNED':
    case 'BOOK_LOST':
    case 'MAX_BORROW_EXCEEDED':
    case 'MAX_RENEW_EXCEEDED':
      return res.status(400).json({ message });
    case 'BORROW_NOT_FOUND':
      return res.status(404).json({ message });
    default:
      return res.status(500).json({ message: '服务异常' });
  }
}

function getOperatorId(req) {
  const userId = req && req.user ? Number(req.user.id) : NaN;
  return Number.isNaN(userId) ? null : userId;
}

/**
 * 获取借阅记录列表
 */
async function getBorrows(req, res) {
  try {
    const result = await listBorrows(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function getMyBorrows(req, res) {
  try {
    const reader = await readerService.getReaderByAccount(req.user);
    if (!reader) {
      return res.status(404).json({ message: '当前账号未关联读者档案' });
    }

    const result = await listBorrowsForReader(reader.id, req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 获取单条借阅记录
 */
async function getBorrowById(req, res) {
  try {
    const result = await getBorrow(req.params.borrowId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function getMyBorrowById(req, res) {
  try {
    const reader = await readerService.getReaderByAccount(req.user);
    if (!reader) {
      return res.status(404).json({ message: '当前账号未关联读者档案' });
    }

    const result = await getBorrowForReader(req.params.borrowId, reader.id);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function createMyBorrow(req, res) {
  try {
    const reader = await readerService.getReaderByAccount(req.user);
    if (!reader) {
      return res.status(404).json({ message: '当前账号未关联读者档案' });
    }

    const dueDate = req.body?.dueDate ? new Date(req.body.dueDate) : new Date();
    if (!req.body?.dueDate) {
      dueDate.setDate(dueDate.getDate() + 30);
    }

    const result = await borrowBook({
      bookId: req.body?.bookId,
      readerId: reader.id,
      dueDate,
      remark: req.body?.remark || '读者自助借阅'
    }, getOperatorId(req));

    res.status(201).json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 创建借阅记录（借出图书）
 */
async function createBorrow(req, res) {
  try {
    const operatorId = getOperatorId(req);
    const result = await borrowBook(req.body, operatorId);
    res.status(201).json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 归还图书
 */
async function doReturn(req, res) {
  try {
    const operatorId = getOperatorId(req);
    const result = await returnBook(req.params.borrowId, req.body, operatorId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function doMyReturn(req, res) {
  try {
    const reader = await readerService.getReaderByAccount(req.user);
    if (!reader) {
      return res.status(404).json({ message: '当前账号未关联读者档案' });
    }

    await getBorrowForReader(req.params.borrowId, reader.id);
    const result = await returnBook(
      req.params.borrowId,
      { ...req.body, remark: req.body?.remark || '读者自助归还' },
      getOperatorId(req)
    );

    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 续期
 */
async function doRenew(req, res) {
  try {
    const role = typeof req.user?.role === 'string' ? req.user.role : req.user?.role?.name;
    if (role !== 'ADMIN') {
      const reader = await readerService.getReaderByAccount(req.user);
      if (!reader) return res.status(404).json({ message: '当前账号未关联读者档案' });
      await getBorrowForReader(req.params.borrowId, reader.id);
    }
    const result = await renewBook(req.params.borrowId, req.body);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 获取超期记录
 */
async function getOverdue(req, res) {
  try {
    const result = await getOverdueRecords(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  getBorrows,
  getMyBorrows,
  getBorrowById,
  getMyBorrowById,
  createMyBorrow,
  createBorrow,
  doReturn,
  doMyReturn,
  doRenew,
  getOverdue
};
