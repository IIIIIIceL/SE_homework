const express = require('express');
const router = express.Router();

// 现有模块
router.use('/books', require('./books/book.routes'));
router.use('/categories', require('./categories/category.routes'));
router.use('/circulation', require('./circulation/circulation.routes'));

// 新增读者模块
router.use('/readers', require('./readers/reader.routes'));

// 新增借阅模块
router.use('/borrows', require('./borrows/borrow.routes'));

// 新增系统管理模块
router.use('/system', require('./system/system.routes'));

// 新增认证模块
router.use('/auth', require('./auth/auth.routes'));

// registerModules 函数用于在 Express app 中注册所有模块路由
function registerModules(app) {
  app.use('/api', router);
}

module.exports = {
  registerModules,
  router
};