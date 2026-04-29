import { toggleLoanReturn } from "./loan.service.js"

export function updateLoanReturnStatus(req, res) {
  const result = toggleLoanReturn(req.params.loanId)
  if (result.error) {
    res.status(404).json({ message: "借阅记录不存在" })
    return
  }
  res.json({ data: result.data })
}
