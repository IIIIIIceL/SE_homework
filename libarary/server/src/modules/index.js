const express = require('express');
const router = express.Router();

// 现有模块
router.use('/books', require('./books/book.routes'));
router.use('/categories', require('./categories/category.routes'));
router.use('/circulation', require('./circulation/circulation.routes'));

// 新增读者模块
router.use('/readers', require('./readers/reader.routes'));

module.exports = router;