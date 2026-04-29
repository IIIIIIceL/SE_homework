import { getBorrowOverview, getHotBooks } from "./report.service.js"

export function borrowDaily(req, res) {
  res.json({ data: getBorrowOverview() })
}

export function hotBooks(req, res) {
  res.json({ data: getHotBooks() })
}
