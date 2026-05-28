import http from './http';

export const systemService = {
  async getStats() {
    const { data } = await http.get('/api/system/stats');
    return data?.data || {};
  },

  async getLogStats(days = 7) {
    const { data } = await http.get('/api/system/logs/stats', { params: { days } });
    return data?.data || {};
  },

  async getRoles(params = {}) {
    const { data } = await http.get('/api/system/roles', { params });
    return {
      data: data?.data || [],
      pagination: data?.pagination || { page: 1, pageSize: 10, total: 0, totalPages: 1 }
    };
  },

  async getRoleDetail(roleId) {
    const { data } = await http.get(`/api/system/roles/${roleId}`);
    return data?.data || null;
  },

  async createRole(payload) {
    const { data } = await http.post('/api/system/roles', payload);
    return data?.data || data;
  },

  async updateRole(roleId, payload) {
    const { data } = await http.put(`/api/system/roles/${roleId}`, payload);
    return data?.data || data;
  },

  async deleteRole(roleId) {
    const { data } = await http.delete(`/api/system/roles/${roleId}`);
    return data?.data || data;
  },

  async getUsers(params = {}) {
    const { data } = await http.get('/api/system/users', { params });
    return {
      data: data?.data || [],
      pagination: data?.pagination || { page: 1, pageSize: 10, total: 0, totalPages: 1 }
    };
  },

  async getUserDetail(userId) {
    const { data } = await http.get(`/api/system/users/${userId}`);
    return data?.data || null;
  },

  async createUser(payload) {
    const { data } = await http.post('/api/system/users', payload);
    return data?.data || data;
  },

  async updateUser(userId, payload) {
    const { data } = await http.put(`/api/system/users/${userId}`, payload);
    return data?.data || data;
  },

  async deleteUser(userId) {
    const { data } = await http.delete(`/api/system/users/${userId}`);
    return data?.data || data;
  },

  async updateUserStatus(userId, status) {
    const { data } = await http.patch(`/api/system/users/${userId}/status`, { status });
    return data?.data || data;
  },

  async restoreUser(userId) {
    const { data } = await http.post(`/api/system/users/${userId}/restore`);
    return data?.data || data;
  },

  async resetUserPassword(userId, newPassword) {
    const { data } = await http.post(`/api/system/users/${userId}/password/reset`, { newPassword });
    return data?.data || data;
  },

  async getLogs(params = {}) {
    const { data } = await http.get('/api/system/logs', { params });
    return {
      data: data?.data || [],
      pagination: data?.pagination || { page: 1, pageSize: 10, total: 0, totalPages: 1 }
    };
  }
};
