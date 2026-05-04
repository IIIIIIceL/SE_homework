-- For teams that want to initialize with plain SQL instead of Prisma migrations.
-- SQLite-compatible schema (close to Prisma generated schema).

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  fullName TEXT NOT NULL,
  roleId INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  lastLoginAt DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (roleId) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS readers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  readerNo TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'UNKNOWN',
  phone TEXT,
  email TEXT,
  department TEXT,
  className TEXT,
  maxBorrowCount INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  remark TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parentId INTEGER,
  FOREIGN KEY (parentId) REFERENCES categories(id),
  UNIQUE(name, parentId)
);

CREATE TABLE IF NOT EXISTS publishers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT,
  address TEXT
);

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  isbn TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  translator TEXT,
  categoryId INTEGER,
  publisherId INTEGER,
  publishDate DATETIME,
  price DECIMAL(10,2),
  totalCopies INTEGER NOT NULL DEFAULT 0,
  availableCopies INTEGER NOT NULL DEFAULT 0,
  location TEXT,
  keywords TEXT,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (publisherId) REFERENCES publishers(id)
);

CREATE TABLE IF NOT EXISTS borrow_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  borrowNo TEXT NOT NULL UNIQUE,
  readerId INTEGER NOT NULL,
  bookId INTEGER NOT NULL,
  borrowDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dueDate DATETIME NOT NULL,
  returnDate DATETIME,
  renewCount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'BORROWED',
  fineAmount DECIMAL(10,2) NOT NULL DEFAULT 0,
  operatorBorrowId INTEGER,
  operatorReturnId INTEGER,
  remark TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (readerId) REFERENCES readers(id),
  FOREIGN KEY (bookId) REFERENCES books(id),
  FOREIGN KEY (operatorBorrowId) REFERENCES users(id),
  FOREIGN KEY (operatorReturnId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS operation_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  action TEXT NOT NULL,
  targetType TEXT,
  targetId TEXT,
  detail TEXT,
  ipAddress TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_users_roleId ON users(roleId);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_readers_name ON readers(name);
CREATE INDEX IF NOT EXISTS idx_readers_status ON readers(status);
CREATE INDEX IF NOT EXISTS idx_categories_parentId ON categories(parentId);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_categoryId ON books(categoryId);
CREATE INDEX IF NOT EXISTS idx_books_publisherId ON books(publisherId);
CREATE INDEX IF NOT EXISTS idx_borrow_readerId ON borrow_records(readerId);
CREATE INDEX IF NOT EXISTS idx_borrow_bookId ON borrow_records(bookId);
CREATE INDEX IF NOT EXISTS idx_borrow_status ON borrow_records(status);
CREATE INDEX IF NOT EXISTS idx_borrow_dueDate ON borrow_records(dueDate);
CREATE INDEX IF NOT EXISTS idx_borrow_borrowDate ON borrow_records(borrowDate);
CREATE INDEX IF NOT EXISTS idx_logs_userId ON operation_logs(userId);
CREATE INDEX IF NOT EXISTS idx_logs_action ON operation_logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_createdAt ON operation_logs(createdAt);
