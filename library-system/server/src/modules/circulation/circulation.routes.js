import { Router } from "express"
import { getLoans, postBorrow, postReturn } from "./circulation.controller.js"

const router = Router()

router.get("/loans", getLoans)
router.post("/borrow", postBorrow)
router.post("/return", postReturn)

export default router
