import db from "../shared/store.js"

function nextBookId() {
  const max = db.books.reduce((acc, book) => {
    const parsed = Number(book.bookId.replace("B", ""))
    return Number.isNaN(parsed) ? acc : Math.max(acc, parsed)
  }, 0)
  return `B${String(max + 1).padStart(6, "0")}`
}

function normalize(payload) {
  return {
    title: (payload.title || "").trim(),
    author: (payload.author || "").trim(),
    isbn: (payload.isbn || "").trim(),
    publisher: (payload.publisher || "").trim(),
    publishDate: (payload.publishDate || "").trim(),
    price: Number(payload.price || 0),
    categoryId: (payload.categoryId || "").trim(),
    shelf: (payload.shelf || "").trim()
  }
}

function fillCategory(bookPayload) {
  const category = db.categories.find((item) => item.categoryId === bookPayload.categoryId)
  if (!category) return null
  return { ...bookPayload, category: category.name }
}

export function listBooks({ keyword = "", status = "all" }) {
  const key = keyword.trim().toLowerCase()
  return db.books.filter((book) => {
    const matchKeyword =
      !key ||
      book.title.toLowerCase().includes(key) ||
      book.author.toLowerCase().includes(key) ||
      book.isbn.toLowerCase().includes(key) ||
      book.bookId.toLowerCase().includes(key)
    const matchStatus = status === "all" || book.status === status
    return matchKeyword && matchStatus
  })
}

export function createBook(payload) {
  const normalized = normalize(payload)
  if (!normalized.title || !normalized.author || !normalized.isbn || !normalized.categoryId) {
    return { error: "MISSING_FIELDS" }
  }
  if (db.books.some((book) => book.isbn === normalized.isbn)) {
    return { error: "DUPLICATE_ISBN" }
  }
  const withCategory = fillCategory(normalized)
  if (!withCategory) return { error: "CATEGORY_NOT_FOUND" }
  const newBook = {
    bookId: nextBookId(),
    ...withCategory,
    status: "in_library"
  }
  db.books.push(newBook)
  return { data: newBook }
}

export function updateBook(bookId, payload) {
  const idx = db.books.findIndex((book) => book.bookId === bookId)
  if (idx < 0) return { error: "NOT_FOUND" }

  const normalized = normalize(payload)
  if (!normalized.title || !normalized.author || !normalized.isbn || !normalized.categoryId) {
    return { error: "MISSING_FIELDS" }
  }
  if (db.books.some((book) => book.isbn === normalized.isbn && book.bookId !== bookId)) {
    return { error: "DUPLICATE_ISBN" }
  }
  const withCategory = fillCategory(normalized)
  if (!withCategory) return { error: "CATEGORY_NOT_FOUND" }
  db.books[idx] = { ...db.books[idx], ...withCategory }
  return { data: db.books[idx] }
}

export function discardBook(bookId) {
  const book = db.books.find((item) => item.bookId === bookId)
  if (!book) return { error: "NOT_FOUND" }
  book.status = "discarded"
  return { data: book }
}

export function updateBookStatus(bookId, status) {
  const book = db.books.find((item) => item.bookId === bookId)
  if (!book) return { error: "NOT_FOUND" }
  book.status = status
  return { data: book }
}
