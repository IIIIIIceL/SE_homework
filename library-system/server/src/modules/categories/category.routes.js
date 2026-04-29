import { Router } from "express"
import {
  deleteCategory,
  getCategories,
  postCategory,
  putCategory
} from "./category.controller.js"

const router = Router()

router.get("/", getCategories)
router.post("/", postCategory)
router.put("/:categoryId", putCategory)
router.delete("/:categoryId", deleteCategory)

export default router
