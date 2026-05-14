import { STORAGE_KEYS } from '../constants/storageKeys';

export function setToken(token) {
  localStorage.setItem(STORAGE_KEYS.token, token);
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function setUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
}
