import http from './http';

export const bookService = {
  async getBooks(params = {}) {
    const { data } = await http.get('/api/books', { params });
    return data;
  },

  async getBookDetail(bookId) {
    const { data } = await http.get(`/api/books/${bookId}`);
    return data.data;
  },

  async createBook(data) {
    const { data: res } = await http.post('/api/books', data);
    return res.data;
  },

  async updateBook(bookId, data) {
    const { data: res } = await http.put(`/api/books/${bookId}`, data);
    return res.data;
  },

  async updateBookStatus(bookId, status) {
    const { data: res } = await http.patch(`/api/books/${bookId}/status`, { status });
    return res.data;
  },

  async deleteBook(bookId) {
    const { data: res } = await http.delete(`/api/books/${bookId}`);
    return res.data;
  },

  async searchBooks(params = {}) {
    const { data } = await http.get('/api/books/search', { params });
    return data;
  }
};
