import { apiRequest } from "../../shared/api/client"

export function fetchCategories() {
  return apiRequest("/categories")
}

export function createCategory(payload) {
  return apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}

export function updateCategory(categoryId, payload) {
  return apiRequest(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  })
}

export function deleteCategory(categoryId) {
  return apiRequest(`/categories/${categoryId}`, { method: "DELETE" })
}
