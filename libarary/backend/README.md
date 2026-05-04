后端 (Express)

安装依赖：

```bash
cd backend
npm install
```

运行：

```bash
npm run dev    # 需全局或本地安装 nodemon
# 或
npm start
```

健康检查： `GET /api/health` 返回 { status: 'ok' }
