import { Router } from "express"
import {
  deleteBook,
  getBooks,
  patchBookStatus,
  postBook,
  putBook
} from "./book.controller.js"

const router = Router()

router.get("/", getBooks)
router.post("/", postBook)
router.put("/:bookId", putBook)
router.delete("/:bookId", deleteBook)
router.patch("/:bookId/status", patchBookStatus)

export default router
