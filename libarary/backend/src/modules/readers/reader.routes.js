const express = require('express');
const router = express.Router();
const readerController = require('./reader.controller');

// 读者管理路由
router.post('/', readerController.createReader);
router.get('/:id', readerController.getReader);
router.get('/', readerController.getAllReaders);
router.get('/:id/history', readerController.getBorrowingHistory);
router.put('/:id', readerController.updateReader);
router.delete('/:id', readerController.deleteReader);

module.exports = router;