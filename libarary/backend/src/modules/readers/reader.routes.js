const express = require('express');
const router = express.Router();
const readerController = require('./reader.controller');
const { authMiddleware, requireRole } = require('../../common/middleware/authMiddleware');

// 读者管理路由
router.use(authMiddleware);

router.get('/me', readerController.getMe);
router.get('/me/history', readerController.getMyBorrowingHistory);
router.put('/me/contact', readerController.updateMyContact);

router.post('/', requireRole('ADMIN'), readerController.createReader);
router.get('/', requireRole('ADMIN'), readerController.getAllReaders);
router.get('/:id', requireRole('ADMIN'), readerController.getReader);
router.get('/:id/history', requireRole('ADMIN'), readerController.getBorrowingHistory);
router.put('/:id', requireRole('ADMIN'), readerController.updateReader);
router.delete('/:id', requireRole('ADMIN'), readerController.deleteReader);

module.exports = router;
