import http from './http';

export const authService = {
  async login(username, password) {
    const { data } = await http.post('/api/auth/login', { username, password });
    return data;
  },

  async register(payload) {
    const { data } = await http.post('/api/auth/register', payload);
    return data;
  },

  async getMe() {
    const { data } = await http.get('/api/auth/me');
    return data.data;
  },

  async logout() {
    const { data } = await http.post('/api/auth/logout');
    return data;
  },

  async verifyToken() {
    const { data } = await http.get('/api/auth/verify');
    return data;
  }
};
