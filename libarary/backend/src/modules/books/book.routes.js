const express = require('express');
const {
  deleteBookById,
  getBookById,
  getBooks,
  patchBookStatus,
  postBook,
  putBook,
  searchBooks
} = require('./book.controller');

const router = express.Router();
const { authMiddleware, requireRole } = require('../../common/middleware/authMiddleware');

router.use(authMiddleware);

router.get('/search', searchBooks);

router.get('/', getBooks);
router.get('/:bookId', getBookById);
router.post('/', requireRole('ADMIN'), postBook);
router.put('/:bookId', requireRole('ADMIN'), putBook);
router.delete('/:bookId', requireRole('ADMIN'), deleteBookById);
router.patch('/:bookId/status', requireRole('ADMIN'), patchBookStatus);

module.exports = router;
