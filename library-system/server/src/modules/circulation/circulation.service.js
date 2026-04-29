import db from "../shared/store.js"

function nextLoanId() {
  const max = db.loans.reduce((acc, loan) => {
    const parsed = Number(loan.id.replace("L", ""))
    return Number.isNaN(parsed) ? acc : Math.max(acc, parsed)
  }, 0)
  return `L${String(max + 1).padStart(3, "0")}`
}

export function borrowBook({ cardNo, bookId }) {
  const reader = db.readers.find((item) => item.cardNo === cardNo)
  if (!reader) return { error: "READER_NOT_FOUND" }
  if (reader.status !== "active") return { error: "READER_INACTIVE" }

  const book = db.books.find((item) => item.bookId === bookId)
  if (!book) return { error: "BOOK_NOT_FOUND" }
  if (book.status !== "in_library") return { error: "BOOK_UNAVAILABLE" }

  const activeLoans = db.loans.filter((loan) => loan.cardNo === cardNo && !loan.returnDate)
  if (activeLoans.length >= 5) return { error: "BORROW_LIMIT_REACHED" }

  const loan = {
    id: nextLoanId(),
    cardNo,
    bookId,
    bookTitle: book.title,
    borrowDate: new Date().toISOString().slice(0, 10),
    returnDate: null
  }
  db.loans.push(loan)
  book.status = "borrowed"
  return { data: loan }
}

export function returnBook({ loanId }) {
  const loan = db.loans.find((item) => item.id === loanId)
  if (!loan) return { error: "LOAN_NOT_FOUND" }
  if (loan.returnDate) return { data: loan, fine: 0 }

  loan.returnDate = new Date().toISOString().slice(0, 10)
  const book = db.books.find((item) => item.bookId === loan.bookId)
  if (book) book.status = "in_library"

  const days =
    (new Date(loan.returnDate).getTime() - new Date(loan.borrowDate).getTime()) /
    (24 * 60 * 60 * 1000)
  const overdueDays = Math.max(0, Math.floor(days - 30))
  const fine = overdueDays * 0.5
  return { data: loan, fine }
}

export function listLoans({ cardNo = "", bookId = "" }) {
  return db.loans.filter((loan) => {
    const cardMatch = !cardNo || loan.cardNo === cardNo
    const bookMatch = !bookId || loan.bookId === bookId
    return cardMatch && bookMatch
  })
}
