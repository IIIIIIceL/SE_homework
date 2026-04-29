import db from "../shared/store.js"

function nextCategoryId() {
  const max = db.categories.reduce((acc, item) => {
    const parsed = Number(item.categoryId.replace("C", ""))
    return Number.isNaN(parsed) ? acc : Math.max(acc, parsed)
  }, 0)
  return `C${String(max + 1).padStart(3, "0")}`
}

function normalize(payload) {
  return {
    name: (payload.name || "").trim(),
    parentId: payload.parentId || null,
    shelfPrefix: (payload.shelfPrefix || "").trim()
  }
}

export function listCategories() {
  return db.categories
}

export function createCategory(payload) {
  const normalized = normalize(payload)
  if (!normalized.name) return { error: "MISSING_FIELDS" }
  if (db.categories.some((item) => item.name === normalized.name)) {
    return { error: "DUPLICATE_NAME" }
  }
  if (
    normalized.parentId &&
    !db.categories.some((item) => item.categoryId === normalized.parentId)
  ) {
    return { error: "PARENT_NOT_FOUND" }
  }

  const created = { categoryId: nextCategoryId(), ...normalized }
  db.categories.push(created)
  return { data: created }
}

export function updateCategory(categoryId, payload) {
  const idx = db.categories.findIndex((item) => item.categoryId === categoryId)
  if (idx < 0) return { error: "NOT_FOUND" }
  const normalized = normalize(payload)
  if (!normalized.name) return { error: "MISSING_FIELDS" }

  if (db.categories.some((item) => item.name === normalized.name && item.categoryId !== categoryId)) {
    return { error: "DUPLICATE_NAME" }
  }

  db.categories[idx] = { ...db.categories[idx], ...normalized }
  return { data: db.categories[idx] }
}

export function removeCategory(categoryId) {
  if (db.books.some((book) => book.categoryId === categoryId)) {
    return { error: "CATEGORY_IN_USE" }
  }
  if (db.categories.some((item) => item.parentId === categoryId)) {
    return { error: "HAS_CHILDREN" }
  }
  const idx = db.categories.findIndex((item) => item.categoryId === categoryId)
  if (idx < 0) return { error: "NOT_FOUND" }
  const deleted = db.categories[idx]
  db.categories.splice(idx, 1)
  return { data: deleted }
}
