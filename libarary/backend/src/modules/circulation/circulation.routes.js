const express = require('express');
const { getBorrowRecords, getBorrowRecordById } = require('./circulation.controller');

const router = express.Router();

/**
 * @route GET /api/circulation/borrow-records
 * @description 查询借阅记录列表（支持时间段、读者、图书、状态等条件过滤）
 * @queryParam {string} startDate - 开始日期（借书时间，格式：YYYY-MM-DD）
 * @queryParam {string} endDate - 结束日期（借书时间，格式：YYYY-MM-DD）
 * @queryParam {number} readerId - 读者 ID
 * @queryParam {number} bookId - 图书 ID
 * @queryParam {string} status - 借阅状态（BORROWED/RETURNED/OVERDUE/LOST）
 * @queryParam {number} page - 页码（默认 1）
 * @queryParam {number} pageSize - 每页数量（默认 10，最大 100）
 * @returns {Object} 分页结果
 */
router.get('/borrow-records', getBorrowRecords);

/**
 * @route GET /api/circulation/borrow-records/:id
 * @description 获取借阅记录详情
 * @returns {Object} 借阅记录详情
 */
router.get('/borrow-records/:id', getBorrowRecordById);

module.exports = router;
