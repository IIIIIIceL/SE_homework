const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function getStorage() {
  return window.sessionStorage;
}

export function setToken(token) {
  try {
    getStorage().setItem(TOKEN_KEY, token);
  } catch (e) {
    // quota exceeded, ignored
  }
}

export function getToken() {
  return getStorage().getItem(TOKEN_KEY);
}

export function clearToken() {
  getStorage().removeItem(TOKEN_KEY);
  getStorage().removeItem(USER_KEY);
}

export function setUser(user) {
  getStorage().setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = getStorage().getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUser() {
  getStorage().removeItem(USER_KEY);
}
