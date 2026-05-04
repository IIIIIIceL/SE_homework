图书管理系统（双人协作，重在 Git 操作）

项目结构：

- backend : Node.js + Express 后端
- frontend: Vite + React 前端

快速开始：

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

建议的 Git 协作流程：

- 每人创建自己的分支： `git checkout -b feat/<your-name>`
- 小步提交并 push： `git add . && git commit -m "feat: ..." && git push -u origin feat/<your-name>`
- 提交 Merge Request / Pull Request，另一个成员复审并合并

