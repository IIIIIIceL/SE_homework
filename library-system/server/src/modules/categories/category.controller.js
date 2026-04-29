import {
  createCategory,
  listCategories,
  removeCategory,
  updateCategory
} from "./category.service.js"

function handleError(res, error) {
  if (error === "NOT_FOUND") return res.status(404).json({ message: "分类不存在" })
  if (error === "MISSING_FIELDS") return res.status(400).json({ message: "分类名称不能为空" })
  if (error === "DUPLICATE_NAME") return res.status(409).json({ message: "分类名称已存在" })
  if (error === "PARENT_NOT_FOUND") return res.status(400).json({ message: "父级分类不存在" })
  if (error === "CATEGORY_IN_USE") return res.status(400).json({ message: "分类已被图书使用，不能删除" })
  if (error === "HAS_CHILDREN") return res.status(400).json({ message: "分类存在子分类，不能删除" })
  return res.status(500).json({ message: "服务异常" })
}

export function getCategories(req, res) {
  res.json({ data: listCategories() })
}

export function postCategory(req, res) {
  const result = createCategory(req.body)
  if (result.error) return handleError(res, result.error)
  res.status(201).json({ data: result.data })
}

export function putCategory(req, res) {
  const result = updateCategory(req.params.categoryId, req.body)
  if (result.error) return handleError(res, result.error)
  res.json({ data: result.data })
}

export function deleteCategory(req, res) {
  const result = removeCategory(req.params.categoryId)
  if (result.error) return handleError(res, result.error)
  res.json({ data: result.data })
}
