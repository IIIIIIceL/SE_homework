import { Router } from "express"
import { updateLoanReturnStatus } from "./loan.controller.js"

const router = Router()

router.patch("/:loanId/toggle-return", updateLoanReturnStatus)

export default router
