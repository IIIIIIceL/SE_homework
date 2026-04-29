const db = {
  categories: [
    { categoryId: "C001", name: "计算机", parentId: null, shelfPrefix: "A" },
    { categoryId: "C002", name: "软件工程", parentId: "C001", shelfPrefix: "A-01" },
    { categoryId: "C003", name: "数据库", parentId: "C001", shelfPrefix: "A-02" }
  ],
  books: [
    {
      bookId: "B000001",
      title: "软件工程导论",
      author: "张某某",
      isbn: "9787302000001",
      publisher: "高等教育出版社",
      publishDate: "2020-01-01",
      price: 59,
      categoryId: "C002",
      category: "软件工程",
      shelf: "A-01-01",
      status: "borrowed"
    },
    {
      bookId: "B000002",
      title: "数据库系统概论",
      author: "王某某",
      isbn: "9787302000002",
      publisher: "高等教育出版社",
      publishDate: "2021-03-01",
      price: 56,
      categoryId: "C003",
      category: "数据库",
      shelf: "A-02-03",
      status: "in_library"
    }
  ],
  readers: [
    {
      cardNo: "LIB000001",
      name: "张三",
      gender: "男",
      idNumber: "110101199001011234",
      contact: "13800000001",
      issueDate: "2026-04-01",
      status: "active"
    },
    {
      cardNo: "LIB000002",
      name: "李四",
      gender: "女",
      idNumber: "110101199202021234",
      contact: "13900000002",
      issueDate: "2026-04-05",
      status: "active"
    }
  ],
  loans: [
    {
      id: "L001",
      cardNo: "LIB000001",
      bookId: "B000001",
      bookTitle: "软件工程导论",
      borrowDate: "2026-04-10",
      returnDate: null
    },
    {
      id: "L002",
      cardNo: "LIB000001",
      bookId: "B000002",
      bookTitle: "计算机网络",
      borrowDate: "2026-04-03",
      returnDate: "2026-04-15"
    },
    {
      id: "L003",
      cardNo: "LIB000002",
      bookId: "B000002",
      bookTitle: "数据库系统概论",
      borrowDate: "2026-04-09",
      returnDate: "2026-04-12"
    }
  ],
  users: [
    { userId: "U001", username: "admin", role: "maintainer", status: "active" },
    { userId: "U002", username: "librarian1", role: "librarian", status: "active" }
  ],
  roles: [
    { roleId: "R001", role: "maintainer", permissions: ["*"] },
    {
      roleId: "R002",
      role: "librarian",
      permissions: ["books:*", "readers:*", "circulation:*", "reports:read"]
    }
  ],
  auditLogs: []
}

export default db
