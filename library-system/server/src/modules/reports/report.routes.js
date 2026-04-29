import { Router } from "express"
import { borrowDaily, hotBooks } from "./report.controller.js"

const router = Router()

router.get("/borrow-daily", borrowDaily)
router.get("/hot-books", hotBooks)

export default router
