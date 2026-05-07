# 系统管理模块文档

## 📋 模块概述

系统管理模块负责管理系统的用户、角色和操作日志，提供完整的访问控制和审计功能。

## 📁 文件结构

```
backend/src/modules/system/
├── system.repository.js      # 数据访问层
├── system.controller.js      # 控制层
├── system.service.js         # 业务逻辑层
├── system.routes.js          # 路由定义
├── dto/
│   └── system.dto.js         # 数据验证和规范化
└── vo/
    └── system.vo.js          # 响应对象格式化
```

## 🔑 核心功能

### 1. 角色管理 (Role)

| 功能 | 端点 | 方法 |
|-----|------|------|
| 获取所有角色 | `/api/system/roles` | GET |
| 获取单个角色 | `/api/system/roles/:roleId` | GET |
| 创建角色 | `/api/system/roles` | POST |
| 更新角色 | `/api/system/roles/:roleId` | PUT |
| 删除角色 | `/api/system/roles/:roleId` | DELETE |

**请求示例：**
```json
POST /api/system/roles
{
  "name": "图书管理员",
  "description": "负责图书馆藏管理"
}
```

**响应示例：**
```json
{
  "data": {
    "id": 1,
    "name": "图书管理员",
    "description": "负责图书馆藏管理",
    "userCount": 2,
    "users": [
      {
        "id": 1,
        "username": "admin1",
        "fullName": "管理员1",
        "status": "ACTIVE"
      }
    ]
  }
}
```

### 2. 用户管理 (User)

| 功能 | 端点 | 方法 |
|-----|------|------|
| 获取所有用户 | `/api/system/users` | GET |
| 获取单个用户 | `/api/system/users/:userId` | GET |
| 创建用户 | `/api/system/users` | POST |
| 更新用户 | `/api/system/users/:userId` | PUT |
| 删除用户 | `/api/system/users/:userId` | DELETE |
| 修改用户状态 | `/api/system/users/:userId/status` | PATCH |

**请求示例：**
```json
POST /api/system/users
{
  "username": "operator1",
  "passwordHash": "hashed_password_here",
  "fullName": "操作员1",
  "roleId": 1,
  "status": "ACTIVE"
}
```

**查询参数：**
- `keyword` - 搜索用户名或真实名称
- `status` - 筛选状态（ACTIVE | DISABLED | ALL）
- `roleId` - 筛选角色
- `page` - 页码（默认1）
- `pageSize` - 每页条数（默认10，最大100）

**修改状态示例：**
```json
PATCH /api/system/users/1/status
{
  "status": "DISABLED"
}
```

### 3. 操作日志 (OperationLog)

| 功能 | 端点 | 方法 |
|-----|------|------|
| 获取操作日志列表 | `/api/system/logs` | GET |
| 获取单条日志 | `/api/system/logs/:logId` | GET |
| 获取用户操作日志 | `/api/system/users/:userId/logs` | GET |
| 记录操作日志 | `/api/system/logs` | POST |

**请求示例：**
```json
POST /api/system/logs
{
  "userId": 1,
  "action": "借出图书",
  "targetType": "BorrowRecord",
  "targetId": "123",
  "detail": "用户借出了《Python编程》",
  "ipAddress": "192.168.1.100"
}
```

**查询参数：**
- `userId` - 按操作员筛选
- `action` - 按操作类型筛选
- `targetType` - 按目标类型筛选（BorrowRecord | Book | Reader等）
- `keyword` - 搜索操作描述
- `days` - 查询最近N天的日志（默认7天）
- `page` - 页码（默认1）
- `pageSize` - 每页条数（默认10，最大100）

## 💾 数据模型

### Role 表
- `id` - 角色ID
- `name` - 角色名称（唯一）
- `description` - 角色描述
- `users` - 使用此角色的用户列表

### User 表
- `id` - 用户ID
- `username` - 用户名（唯一）
- `passwordHash` - 密码哈希值
- `fullName` - 用户真实名称
- `roleId` - 所属角色ID
- `status` - 用户状态（ACTIVE | DISABLED）
- `lastLoginAt` - 最后登录时间
- `createdAt` - 创建时间
- `updatedAt` - 更新时间

### OperationLog 表
- `id` - 日志ID
- `userId` - 操作员ID
- `action` - 操作类型
- `targetType` - 目标类型
- `targetId` - 目标ID
- `detail` - 操作详情
- `ipAddress` - 操作IP
- `createdAt` - 操作时间

## ✅ 校验规则

### 角色创建/更新
- 角色名称不能为空
- 角色名称不能重复
- 删除角色前需确保无用户使用

### 用户创建
- 用户名不能为空
- 用户名不能重复
- 密码不能为空
- 真实名称不能为空
- 角色必须存在
- 默认状态为 ACTIVE

### 用户更新
- 状态必须为有效值（ACTIVE | DISABLED）
- 角色必须存在

### 操作日志
- 操作类型不能为空
- 其他字段可选

## 🔐 权限考虑

当前模块不包含权限认证逻辑。建议在中间件中添加：
- 只有管理员可以创建/删除用户和角色
- 用户只能查看自己的操作日志
- 记录所有系统管理操作

## 📝 TODO 事项

1. **认证中间件** - 在controller中添加权限检查
2. **密码加密** - 集成密码加密库（bcrypt等）
3. **操作日志自动记录** - 为重要操作自动记录日志
4. **导出功能** - 支持导出用户列表和操作日志
5. **角色权限关联** - 扩展Role模型以支持具体权限

