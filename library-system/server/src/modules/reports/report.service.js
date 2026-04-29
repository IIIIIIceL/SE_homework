import db from "../shared/store.js"

export function getBorrowOverview() {
  const total = db.loans.length
  const active = db.loans.filter((loan) => !loan.returnDate).length
  const returned = total - active
  return { total, active, returned }
}

export function getHotBooks() {
  const counter = db.loans.reduce((acc, loan) => {
    acc[loan.bookTitle] = (acc[loan.bookTitle] || 0) + 1
    return acc
  }, {})
  return Object.entries(counter)
    .map(([bookTitle, borrowTimes]) => ({ bookTitle, borrowTimes }))
    .sort((a, b) => b.borrowTimes - a.borrowTimes)
    .slice(0, 10)
}
