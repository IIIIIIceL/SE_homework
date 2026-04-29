import { apiRequest } from "../../shared/api/client"

export function fetchBooks(params = {}) {
  const query = new URLSearchParams({
    keyword: params.keyword || "",
    status: params.status || "all"
  })
  return apiRequest(`/books?${query.toString()}`)
}

export function createBook(payload) {
  return apiRequest("/books", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}

export function updateBook(bookId, payload) {
  return apiRequest(`/books/${bookId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  })
}

export function deleteBook(bookId) {
  return apiRequest(`/books/${bookId}`, { method: "DELETE" })
}
