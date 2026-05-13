const express = require('express');
const {
  postLogin,
  postRegister,
  getCurrentUserInfo,
  verifyToken,
  postLogout
} = require('./auth.controller');
const { authMiddleware, optionalAuthMiddleware } = require('../../common/middleware/authMiddleware');

const router = express.Router();

// 公开路由（无需认证）
router.post('/login', postLogin);
router.post('/register', postRegister);
router.get('/verify', verifyToken);

// 需要认证的路由
router.get('/me', authMiddleware, getCurrentUserInfo);
router.post('/logout', authMiddleware, postLogout);

module.exports = router;
