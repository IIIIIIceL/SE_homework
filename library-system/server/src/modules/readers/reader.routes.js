import { Router } from "express"
import {
  addReader,
  editReader,
  listReaderLoans,
  listReaders,
  removeReader
} from "./reader.controller.js"

const router = Router()

router.get("/", listReaders)
router.post("/", addReader)
router.put("/:cardNo", editReader)
router.delete("/:cardNo", removeReader)
router.get("/:cardNo/loans", listReaderLoans)

export default router
