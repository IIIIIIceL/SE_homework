后端 (Express + Prisma)

## 1. 安装依赖

```bash
cd backend
npm install
```

## 2. 初始化数据库

复制环境变量文件：

```bash
copy .env.example .env
```

初始化 SQLite 数据库并生成 Prisma Client：

```bash
npm run db:push
npm run db:seed
```

## 3. 运行服务

```bash
npm run dev
# 或
npm start
```

## 4. 健康检查

- `GET /api/health` 服务健康
- `GET /api/health/db` 数据库连接健康

## 5. 数据库设计文件

- `prisma/schema.prisma`：数据库结构定义（主用）
- `prisma/seed.js`：初始化种子数据
- `docs/database-design.md`：E-R 对应的结构化说明
- `sql/init.sql`：可选的纯 SQL 初始化脚本
