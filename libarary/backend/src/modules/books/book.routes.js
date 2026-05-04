const express = require('express');
const {
  deleteBookById,
  getBookById,
  getBooks,
  patchBookStatus,
  postBook,
  putBook
} = require('./book.controller');

const router = express.Router();

router.get('/', getBooks);
router.get('/:bookId', getBookById);
router.post('/', postBook);
router.put('/:bookId', putBook);
router.delete('/:bookId', deleteBookById);
router.patch('/:bookId/status', patchBookStatus);

module.exports = router;