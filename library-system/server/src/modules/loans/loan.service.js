import db from "../shared/store.js"

export function toggleLoanReturn(loanId) {
  const loan = db.loans.find((item) => item.id === loanId)
  if (!loan) {
    return { error: "NOT_FOUND" }
  }
  loan.returnDate = loan.returnDate ? null : new Date().toISOString().slice(0, 10)
  return { data: loan }
}
