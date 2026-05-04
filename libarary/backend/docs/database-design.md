# 图书管理系统数据库设计

## 1. 设计范围

本设计覆盖以下业务模块：

- 图书信息管理
- 借阅与归还管理
- 读者信息管理
- 系统管理（用户、角色、操作日志）
- 查询与统计（通过索引和借阅记录支撑）

## 2. 核心实体与关系

- Role 1:N User
- User 1:N BorrowRecord（借出操作员、归还操作员）
- Reader 1:N BorrowRecord
- Category 1:N Book（支持父子分类）
- Publisher 1:N Book
- Book 1:N BorrowRecord
- User 1:N OperationLog

## 3. 数据表清单

- roles：角色定义
- users：系统用户
- readers：读者档案
- categories：图书分类（树结构）
- publishers：出版社
- books：图书主数据与馆藏数量
- borrow_records：借阅流水
- operation_logs：系统操作日志

## 4. 关键约束

- users.username 唯一
- readers.readerNo 唯一
- books.isbn 唯一
- borrow_records.borrowNo 唯一
- categories(name, parentId) 联合唯一
- 借阅逻辑通过事务控制：借出时 availableCopies -1，归还时 +1

## 5. 索引策略

- readers(name, status)
- books(title, author, status, categoryId, publisherId)
- borrow_records(readerId, bookId, status, dueDate, borrowDate)
- operation_logs(userId, action, createdAt)

## 6. 状态枚举

- UserStatus: ACTIVE, DISABLED
- ReaderStatus: ACTIVE, SUSPENDED, CANCELLED
- BookStatus: AVAILABLE, OFF_SHELF
- BorrowStatus: BORROWED, RETURNED, OVERDUE, LOST

## 7. 统计能力示例

- 当前在借数量：borrow_records.status IN (BORROWED, OVERDUE)
- 超期列表：status = OVERDUE 且 dueDate < 当前时间
- 热门图书：按 borrow_records.bookId 聚合计数
- 活跃读者：按 borrow_records.readerId 聚合计数
