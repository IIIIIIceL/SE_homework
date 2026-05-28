const express = require('express');

const router = express.Router();

router.use('/books', require('./books/book.routes'));
router.use('/circulation', require('./circulation/circulation.routes'));
router.use('/readers', require('./readers/reader.routes'));
router.use('/borrows', require('./borrows/borrow.routes'));
router.use('/system', require('./system/system.routes'));
router.use('/auth', require('./auth/auth.routes'));
router.use('/statistics', require('./statistics/statistics.routes'));

function registerModules(app) {
  app.use('/api', router);
}

module.exports = {
  registerModules,
  router
};
