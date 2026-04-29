import { borrowBook, listLoans, returnBook } from "./circulation.service.js"

function handleError(res, error) {
  if (error === "READER_NOT_FOUND") return res.status(404).json({ message: "读者不存在" })
  if (error === "READER_INACTIVE") return res.status(400).json({ message: "读者状态不可借阅" })
  if (error === "BOOK_NOT_FOUND") return res.status(404).json({ message: "图书不存在" })
  if (error === "BOOK_UNAVAILABLE") return res.status(400).json({ message: "图书不在馆" })
  if (error === "BORROW_LIMIT_REACHED") return res.status(400).json({ message: "读者借阅已达上限" })
  if (error === "LOAN_NOT_FOUND") return res.status(404).json({ message: "借阅记录不存在" })
  return res.status(500).json({ message: "服务异常" })
}

export function postBorrow(req, res) {
  const result = borrowBook(req.body)
  if (result.error) return handleError(res, result.error)
  res.status(201).json({ data: result.data })
}

export function postReturn(req, res) {
  const result = returnBook(req.body)
  if (result.error) return handleError(res, result.error)
  res.json({ data: result.data, fine: result.fine })
}

export function getLoans(req, res) {
  res.json({ data: listLoans(req.query) })
}
