/**
 * 认证模块使用示例
 * 展示如何在其他模块中集成认证
 */

// ============================================
// 示例 1: 保护图书管理路由
// ============================================

// 文件: src/modules/books/book.routes.js
/*
const express = require('express');
const { authMiddleware, requireRole } = require('../../common/middleware/authMiddleware');
const { getBooks, createBook, updateBook, deleteBook } = require('./book.controller');

const router = express.Router();

// 公开：查询图书列表（不需要认证）
router.get('/', getBooks);

// 受保护：创建图书（仅管理员）
router.post('/', authMiddleware, requireRole('admin'), createBook);

// 受保护：更新图书（仅管理员）
router.put('/:id', authMiddleware, requireRole('admin'), updateBook);

// 受保护：删除图书（仅管理员）
router.delete('/:id', authMiddleware, requireRole('admin'), deleteBook);

module.exports = router;
*/

// ============================================
// 示例 2: 在 Controller 中访问当前用户
// ============================================

/*
// 文件: src/modules/borrows/borrow.controller.js
const { borrowBook } = require('./borrow.service');

async function postBorrow(req, res) {
  try {
    // req.user 包含当前认证用户信息
    const userId = req.user.id;
    const username = req.user.username;
    
    console.log(`用户 ${username} 正在借书`);
    
    const result = await borrowBook({
      readerId: req.body.readerId,
      bookId: req.body.bookId,
      operatorId: userId  // 记录操作员
    });
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { postBorrow };
*/

// ============================================
// 示例 3: 系统管理模块中的认证
// ============================================

/*
// 文件: src/modules/system/system.routes.js
const express = require('express');
const { authMiddleware, requireRole } = require('../../common/middleware/authMiddleware');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('./system.controller');

const router = express.Router();

// 获取用户列表（仅管理员）
router.get('/users', authMiddleware, requireRole('admin'), getUsers);

// 创建用户（仅管理员）
router.post('/users', authMiddleware, requireRole('admin'), createUser);

// 更新用户（仅管理员或用户自己）
router.put('/users/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const targetId = parseInt(req.params.id);
  
  // 仅允许管理员或用户自己修改
  if (req.user.role !== 'admin' && userId !== targetId) {
    return res.status(403).json({ message: '无权修改其他用户' });
  }
  
  const result = await updateUser(targetId, req.body);
  res.json(result);
});

// 删除用户（仅管理员）
router.delete('/users/:id', authMiddleware, requireRole('admin'), deleteUser);

module.exports = router;
*/

// ============================================
// 示例 4: 客户端完整登录流程
// ============================================

/*
// 前端代码示例 (JavaScript/Fetch API)

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // 登录
  async login(username, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error('登录失败');
    }

    const data = await res.json();
    this.token = data.token;
    localStorage.setItem('token', this.token);
    return data;
  }

  // 获取受保护资源
  async fetchProtected(url) {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (res.status === 401) {
      // 令牌过期或无效
      this.logout();
      window.location.href = '/login';
      return;
    }

    return res.json();
  }

  // 登出
  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // 获取当前用户
  async getCurrentUser() {
    return this.fetchProtected('/api/auth/me');
  }
}

// 使用示例
const auth = new AuthService();

// 登录
await auth.login('admin', 'password123');

// 获取用户列表
const users = await auth.fetchProtected('/api/system/users');
console.log(users);

// 登出
auth.logout();
*/

// ============================================
// 示例 5: 使用可选认证中间件
// ============================================

/*
// 文件: src/modules/books/book.routes.js
const { optionalAuthMiddleware } = require('../../common/middleware/authMiddleware');

// 获取图书详情（支持已认证和未认证用户）
router.get('/detail/:id', optionalAuthMiddleware, (req, res) => {
  const bookId = req.params.id;
  const user = req.user;
  
  if (user) {
    // 已认证用户逻辑：可以显示个人借阅状态
    console.log(`用户 ${user.username} 查看图书 ${bookId}`);
  } else {
    // 未认证用户：只显示基本信息
    console.log(`访客查看图书 ${bookId}`);
  }
  
  // 返回图书信息
  res.json({ bookId, info: '...' });
});
*/

// ============================================
// 示例 6: 基于角色的操作限制
// ============================================

/*
// 文件: src/modules/system/system.controller.js

async function createUser(req, res) {
  try {
    // req.user.role 包含当前用户的角色
    // requireRole('admin') 中间件已经检查了权限
    
    const newUser = await userService.create({
      ...req.body,
      createdBy: req.user.id  // 记录创建者
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  const userId = parseInt(req.params.id);
  const currentUser = req.user;
  
  // 自定义权限检查
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    return res.status(403).json({
      message: '仅管理员或用户本身可修改用户信息'
    });
  }
  
  const updated = await userService.update(userId, {
    ...req.body,
    updatedBy: currentUser.id  // 记录修改者
  });
  
  res.json(updated);
}
*/

// ============================================
// 示例 7: 集成操作日志
// ============================================

/*
// 文件: src/modules/system/system.controller.js
const operationLogService = require('../operationLog/operationLog.service');

async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    
    // 执行删除操作
    const result = await userService.delete(userId);
    
    // 记录操作日志
    await operationLogService.create({
      userId: req.user.id,
      action: '删除用户',
      targetType: 'User',
      targetId: String(userId),
      detail: `管理员 ${req.user.username} 删除了用户 ${result.username}`
    });
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
*/

// ============================================
// 示例 8: 错误处理
// ============================================

/*
// 前端 HTTP 拦截器示例 (使用 Fetch API)

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    ...options,
    headers
  });
  
  // 处理认证错误
  if (res.status === 401) {
    // 令牌无效或过期
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  
  if (res.status === 403) {
    // 权限不足
    alert('您没有权限执行此操作');
    return;
  }
  
  return res.json();
}

// 使用
await fetchWithAuth('/api/system/users', { method: 'GET' });
*/

// ============================================
// 示例 9: 配置环境变量
// ============================================

/*
// .env 文件

# JWT 配置
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 数据库配置
DATABASE_URL="file:./dev.db"

# 服务器配置
NODE_ENV=development
PORT=3001
*/

// ============================================
// 示例 10: 在 Postman 中测试
// ============================================

/*

1. 登录获取令牌
   POST /api/auth/login
   Body:
   {
     "username": "admin",
     "password": "password123"
   }
   
   响应:
   {
     "user": {...},
     "token": "eyJhbGc...",
     "refreshToken": "eyJhbGc...",
     "expiresIn": "7d",
     "tokenType": "Bearer"
   }

2. 使用令牌访问受保护资源
   GET /api/system/users
   
   在 "Auth" 选项卡中:
   - Type: Bearer Token
   - Token: <粘贴从登录响应获得的 token>

3. 或在请求头中手动添加:
   GET /api/system/users
   Header: Authorization: Bearer eyJhbGc...

4. 验证令牌
   GET /api/auth/verify
   Header: Authorization: Bearer <token>

*/

module.exports = {
  // 这个文件仅包含示例，不导出任何内容
};
