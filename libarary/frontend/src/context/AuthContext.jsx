import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import {
  setToken,
  getToken,
  clearToken,
  setUser,
  getUser,
  clearUser
} from '../utils/tokenManager';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser) {
      setLocalUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await authService.login(username, password);
    setToken(result.token);
    setUser(result.user);
    setLocalUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Backend unreachable, clear local state anyway
    }
    clearToken();
    clearUser();
    setLocalUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLocalUser(null);
      return false;
    }
    try {
      const user = await authService.getMe();
      setUser(user);
      setLocalUser(user);
      return true;
    } catch {
      clearToken();
      clearUser();
      setLocalUser(null);
      return false;
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
