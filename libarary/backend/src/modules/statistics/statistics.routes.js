const express = require('express');
const {
  handleBorrowRecords,
  handleBorrowTrend,
  handlePopularBooks,
  handleInventory
} = require('./statistics.controller');

const router = express.Router();

// 借阅记录查询（按时间段）
router.get('/borrow-records', handleBorrowRecords);

// 日/月借阅量趋势
router.get('/borrow-trend', handleBorrowTrend);

// 热门图书排行
router.get('/popular-books', handlePopularBooks);

// 库存盘点报表
router.get('/inventory', handleInventory);

module.exports = router;
