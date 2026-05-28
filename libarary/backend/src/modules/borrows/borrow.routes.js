const express = require('express');
const {
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
} = require('./borrow.controller');
const { authMiddleware, requireRole } = require('../../common/middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/my', getMyBorrows);
router.post('/my', createMyBorrow);
router.post('/my/:borrowId/return', doMyReturn);
router.get('/my/:borrowId', getMyBorrowById);

// 获取超期记录列表
router.get('/overdue', requireRole('ADMIN'), getOverdue);

// 获取借阅记录列表
router.get('/', requireRole('ADMIN'), getBorrows);

// 获取单条借阅记录
router.get('/:borrowId', requireRole('ADMIN'), getBorrowById);

// 创建借阅记录（借出图书）
router.post('/', requireRole('ADMIN'), createBorrow);

// 归还图书
router.post('/:borrowId/return', requireRole('ADMIN'), doReturn);

// 续期
router.post('/:borrowId/renew', doRenew);

module.exports = router;
