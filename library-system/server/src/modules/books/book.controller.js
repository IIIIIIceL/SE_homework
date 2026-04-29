import {
  createBook,
  discardBook,
  listBooks,
  updateBook,
  updateBookStatus
} from "./book.service.js"

function handleError(res, error) {
  if (error === "NOT_FOUND") return res.status(404).json({ message: "图书不存在" })
  if (error === "MISSING_FIELDS") return res.status(400).json({ message: "图书关键字段缺失" })
  if (error === "DUPLICATE_ISBN") return res.status(409).json({ message: "ISBN 已存在" })
  if (error === "CATEGORY_NOT_FOUND") return res.status(400).json({ message: "图书分类不存在" })
  return res.status(500).json({ message: "服务异常" })
}

export function getBooks(req, res) {
  res.json({ data: listBooks(req.query) })
}

export function postBook(req, res) {
  const result = createBook(req.body)
  if (result.error) return handleError(res, result.error)
  res.status(201).json({ data: result.data })
}

export function putBook(req, res) {
  const result = updateBook(req.params.bookId, req.body)
  if (result.error) return handleError(res, result.error)
  res.json({ data: result.data })
}

export function deleteBook(req, res) {
  const result = discardBook(req.params.bookId)
  if (result.error) return handleError(res, result.error)
  res.json({ data: result.data })
}

export function patchBookStatus(req, res) {
  const result = updateBookStatus(req.params.bookId, req.body.status)
  if (result.error) return handleError(res, result.error)
  res.json({ data: result.data })
}
