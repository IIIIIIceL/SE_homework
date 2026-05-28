import http from './http';

export const readerService = {
  async getReaders(params = {}) {
    const { data } = await http.get('/api/readers', { params });

    return {
      data: data?.data || [],
      total: data?.pagination?.total || 0,
      page: data?.pagination?.page || params.page || 1,
      pageSize: data?.pagination?.pageSize || params.pageSize || 10,
      totalPages: data?.pagination?.totalPages || 1
    };
  },

  async getReaderDetail(readerId) {
    const { data } = await http.get(`/api/readers/${readerId}`);
    return data;
  },

  async createReader(payload) {
    const { data } = await http.post('/api/readers', payload);
    return data;
  },

  async updateReader(readerId, payload) {
    const { data } = await http.put(`/api/readers/${readerId}`, payload);
    return data;
  },

  async deleteReader(readerId) {
    const { data } = await http.delete(`/api/readers/${readerId}`);
    return data;
  },

  async getReaderHistory(readerId) {
    const { data } = await http.get(`/api/readers/${readerId}/history`);
    return Array.isArray(data) ? data : [];
  }
};
