import http from './http';

export const borrowService = {
  async getBorrows(params = {}) {
    const { data } = await http.get('/api/borrows', { params });
    return data;
  },

  async getBorrowDetail(borrowId) {
    const { data } = await http.get(`/api/borrows/${borrowId}`);
    return data.data;
  },

  async getMyBorrows(params = {}) {
    const { data } = await http.get('/api/borrows/my', { params });
    return data;
  },

  async getMyBorrowDetail(borrowId) {
    const { data } = await http.get(`/api/borrows/my/${borrowId}`);
    return data.data;
  },

  async borrowMyBook(bookId, data = {}) {
    const { data: res } = await http.post('/api/borrows/my', { ...data, bookId });
    return res.data;
  },

  async returnMyBook(borrowId, data = {}) {
    const { data: res } = await http.post(`/api/borrows/my/${borrowId}/return`, data);
    return res.data;
  },

  async borrowBook(data) {
    const { data: res } = await http.post('/api/borrows', data);
    return res.data;
  },

  async returnBook(borrowId, data = {}) {
    const { data: res } = await http.post(`/api/borrows/${borrowId}/return`, data);
    return res.data;
  },

  async renewBook(borrowId, data = {}) {
    const { data: res } = await http.post(`/api/borrows/${borrowId}/renew`, data);
    return res.data;
  },

  async getOverdueRecords(params = {}) {
    const { data } = await http.get('/api/borrows/overdue', { params });
    return data;
  }
};
