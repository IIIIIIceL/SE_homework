/**
 * 认证相关数据验证和规范化
 */

function normalizeLoginInput(data = {}) {
  return {
    username: data.username ? String(data.username).trim() : null,
    password: data.password ? String(data.password) : null
  };
}

function normalizeRegisterInput(data = {}) {
  return {
    username: data.username ? String(data.username).trim() : null,
    password: data.password ? String(data.password) : null,
    confirmPassword: data.confirmPassword ? String(data.confirmPassword) : null,
    fullName: data.fullName ? String(data.fullName).trim() : null,
    roleId: data.roleId ? Number(data.roleId) : null
  };
}

function normalizeRefreshTokenInput(data = {}) {
  return {
    refreshToken: data.refreshToken ? String(data.refreshToken).trim() : null
  };
}

module.exports = {
  normalizeLoginInput,
  normalizeRegisterInput,
  normalizeRefreshTokenInput
};
