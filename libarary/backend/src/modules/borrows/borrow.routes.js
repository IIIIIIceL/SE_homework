const express = require('express');
const {
  getBorrows,
  getBorrowById,
  createBorrow,
  doReturn,
  doRenew,
  getOverdue
} = require('./borrow.controller');

const router = express.Router();

// 获取超期记录列表
router.get('/overdue', getOverdue);

// 获取借阅记录列表
router.get('/', getBorrows);

// 获取单条借阅记录
router.get('/:borrowId', getBorrowById);

// 创建借阅记录（借出图书）
router.post('/', createBorrow);

// 归还图书
router.post('/:borrowId/return', doReturn);

// 续期
router.post('/:borrowId/renew', doRenew);

module.exports = router;
