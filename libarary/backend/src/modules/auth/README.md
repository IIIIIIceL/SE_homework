# 认证模块 (Auth Module)

## 模块概述

认证模块是整个图书馆管理系统的安全基础，负责用户登录、注册、令牌管理和身份验证。采用 JWT（JSON Web Token）实现无状态认证。

## 核心功能

### 1. 用户登录 (Login)
- **端点**: `POST /auth/login`
- **请求体**:
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **响应** (200 OK):
  ```json
  {
    "user": {
      "id": 1,
      "username": "admin",
      "fullName": "管理员",
      "role": {
        "id": 1,
        "name": "admin"
      },
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": "7d",
    "tokenType": "Bearer"
  }
  ```
- **错误处理**:
  - 400: 用户名或密码错误、用户已禁用/删除
  - 404: 用户不存在

### 2. 用户注册 (Register)
- **端点**: `POST /auth/register`
- **请求体**:
  ```json
  {
    "username": "newuser",
    "password": "password123",
    "confirmPassword": "password123",
    "fullName": "张三",
    "roleId": 2
  }
  ```
- **响应** (201 Created): 与登录相同
- **验证规则**:
  - 用户名不能重复
  - 密码长度 6-50 字符
  - 密码确认必须匹配

### 3. 获取当前用户信息 (Get Current User)
- **端点**: `GET /auth/me`
- **认证**: 需要 Bearer Token
- **响应** (200 OK):
  ```json
  {
    "data": {
      "id": 1,
      "username": "admin",
      "fullName": "管理员",
      "role": "admin",
      "status": "ACTIVE"
    }
  }
  ```

### 4. 验证令牌 (Verify Token)
- **端点**: `GET /auth/verify`
- **请求头**: Authorization: Bearer \<token\>
- **响应** (200 OK):
  ```json
  {
    "data": {
      "id": 1,
      "username": "admin",
      "fullName": "管理员",
      "role": "admin",
      "status": "ACTIVE",
      "iat": 1234567890,
      "exp": 1234654290
    },
    "valid": true
  }
  ```

### 5. 用户登出 (Logout)
- **端点**: `POST /auth/logout`
- **认证**: 需要 Bearer Token
- **响应** (200 OK):
  ```json
  {
    "message": "登出成功"
  }
  ```

## 架构设计

### 模块结构
```
auth/
├── auth.controller.js    # HTTP 请求处理器
├── auth.repository.js    # 数据库访问层
├── auth.service.js       # 业务逻辑层
├── auth.routes.js        # 路由定义
├── dto/
│   └── auth.dto.js       # 数据验证和规范化
├── vo/
│   └── auth.vo.js        # 响应对象格式化
└── README.md             # 本文件
```

### 依赖关系
```
Routes (auth.routes.js)
    ↓
Controller (auth.controller.js)
    ↓
Service (auth.service.js)
    ↓
Repository (auth.repository.js) + DTO (auth.dto.js) + VO (auth.vo.js)
    ↓
Database (Prisma ORM)
```

## 工具模块

### JWT 工具 (src/common/utils/jwt.js)
- `generateToken(payload, options)`: 生成 JWT 令牌
- `verifyToken(token)`: 验证令牌有效性
- `decodeToken(token)`: 解码令牌（不验证签名）

### 密码工具 (src/common/utils/password.js)
- `hashPassword(password)`: 哈希密码（当前使用 Base64+salt，生产建议使用 bcrypt）
- `verifyPassword(inputPassword, hashedPassword)`: 验证密码
- `validatePasswordStrength(password)`: 检查密码强度

## 认证中间件

### authMiddleware (src/common/middleware/authMiddleware.js)
用于保护需要认证的路由：
```javascript
router.get('/protected', authMiddleware, (req, res) => {
  // req.user 包含认证用户信息
});
```

### requireRole
检查用户是否拥有指定角色：
```javascript
router.delete('/users/:id', requireRole('admin'), deleteUser);
```

### optionalAuthMiddleware
可选认证中间件，如果提供令牌则验证，没有令牌也继续：
```javascript
router.get('/public-data', optionalAuthMiddleware, getData);
```

## 使用示例

### 1. 客户端登录流程
```javascript
// 1. 用户登录
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'password123'
  })
});

const { token } = await loginRes.json();

// 2. 在后续请求中使用令牌
const protectedRes = await fetch('/api/system/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 2. 服务器端受保护路由
```javascript
const { authMiddleware, requireRole } = require('../common/middleware/authMiddleware');
const router = express.Router();

// 所有用户都可以访问
router.get('/public', (req, res) => {
  res.json({ data: 'public' });
});

// 需要认证的路由
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// 仅管理员可以访问
router.delete('/users/:id', authMiddleware, requireRole('admin'), deleteUser);
```

## 错误处理

| 错误代码 | HTTP 状态 | 说明 |
|---------|---------|------|
| MISSING_FIELDS | 400 | 缺少必填字段 |
| INVALID_PASSWORD | 400 | 密码不一致 |
| WEAK_PASSWORD | 400 | 密码强度不足 |
| INVALID_CREDENTIALS | 400 | 用户名或密码错误 |
| USER_INACTIVE | 400 | 用户已禁用/删除 |
| DUPLICATE_USERNAME | 400 | 用户名已存在 |
| INVALID_TOKEN | 400 | 令牌无效或已过期 |
| NO_TOKEN | 400 | 缺少令牌 |
| ROLE_NOT_FOUND | 404 | 角色不存在 |
| USER_NOT_FOUND | 404 | 用户不存在 |

## JWT 令牌结构

JWT 令牌包含以下信息：
```json
{
  "id": 1,                    // 用户ID
  "username": "admin",        // 用户名
  "fullName": "管理员",        // 真实名称
  "role": "admin",            // 角色名称
  "status": "ACTIVE",         // 用户状态
  "iat": 1234567890,          // 发行时间
  "exp": 1234654290           // 过期时间（7天后）
}
```

## 生产环境建议

1. **密码加密**: 将 Base64+salt 替换为 bcrypt
   ```bash
   npm install bcrypt
   ```

2. **令牌黑名单**: 实现登出时的令牌黑名单（可选）

3. **速率限制**: 对登录端点添加速率限制防止暴力破解

4. **HTTPS**: 生产环境必须使用 HTTPS

5. **环境变量**: 配置 JWT_SECRET 和 JWT_EXPIRES_IN
   ```
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   ```

6. **审计日志**: 记录所有认证事件到操作日志

## 集成点

- **系统模块** (`src/modules/system/`): 用户和角色管理
- **操作日志**: 记录登录/登出等认证事件
- **错误处理**: 使用 errorHandler 中间件处理认证错误
- **其他模块**: 通过 authMiddleware 保护 API 端点

## 配置环境变量

在 `.env` 或 `process.env` 中配置：
```
JWT_SECRET=your-very-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## 与其他模块的集成

### 系统管理模块集成
认证模块使用系统管理模块提供的用户和角色服务：
- 验证用户名的唯一性
- 查询用户的角色和权限
- 验证用户状态（ACTIVE/DISABLED/DELETED）

### 操作日志集成
认证操作记录到操作日志：
- 登录成功
- 登录失败
- 登出
- 令牌刷新

## 常见问题

### 1. 令牌过期后怎么办？
使用 refresh endpoint 获取新令牌（未实现，可选功能）

### 2. 忘记密码怎么办？
由系统管理员使用 `resetPassword` 功能

### 3. 支持第三方登录吗？
当前不支持，可在生产版本中集成 OAuth

### 4. 跨域请求需要特殊处理吗？
前端需要在请求头中包含 Authorization header，后端需要配置 CORS

---

**创建日期**: 2024-01
**模块状态**: 完成
**测试状态**: 基础测试通过
**生产就绪**: 否（建议在生产前进行安全审计）
