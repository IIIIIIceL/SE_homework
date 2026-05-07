const {
  borrowBook,
  returnBook,
  renewBook,
  listBorrows,
  getBorrow,
  getOverdueRecords
} = require('./borrow.service');

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

/**
 * 创建借阅记录（借出图书）
 */
async function createBorrow(req, res) {
  try {
    // TODO: 从请求上下文获取当前操作员ID
    const operatorId = req.user?.id || null;
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
    // TODO: 从请求上下文获取当前操作员ID
    const operatorId = req.user?.id || null;
    const result = await returnBook(req.params.borrowId, req.body, operatorId);
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
  getBorrowById,
  createBorrow,
  doReturn,
  doRenew,
  getOverdue
};
