const express = require('express');
const {
  // 角色管理
  getRoles,
  getRoleById,
  postRole,
  putRole,
  deleteRoleById,
  // 用户管理
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUserById,
  patchUserStatus,
  restoreUserById,
  // 密码管理
  changeUserPassword,
  resetUserPassword,
  // 用户验证
  validateUserLogin,
  // 系统统计
  getStats,
  getLogStats,
  // 操作日志
  getLogs,
  getLogById,
  getUserLogs,
  recordLog
} = require('./system.controller');

const router = express.Router();

// ==================== 角色管理路由 ====================
router.get('/roles', getRoles);
router.get('/roles/:roleId', getRoleById);
router.post('/roles', postRole);
router.put('/roles/:roleId', putRole);
router.delete('/roles/:roleId', deleteRoleById);

// ==================== 用户管理路由 ====================
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', postUser);
router.put('/users/:userId', putUser);
router.delete('/users/:userId', deleteUserById);
router.patch('/users/:userId/status', patchUserStatus);
router.post('/users/:userId/restore', restoreUserById);

// ==================== 密码管理路由 ====================
router.post('/users/:userId/password/change', changeUserPassword);
router.post('/users/:userId/password/reset', resetUserPassword);

// ==================== 用户验证路由 ====================
router.post('/validate', validateUserLogin);

// ==================== 系统统计路由 ====================
router.get('/stats', getStats);
router.get('/logs/stats', getLogStats);

// ==================== 操作日志路由 ====================
router.get('/logs', getLogs);
router.get('/logs/:logId', getLogById);
router.get('/users/:userId/logs', getUserLogs);
router.post('/logs', recordLog);

module.exports = router;
