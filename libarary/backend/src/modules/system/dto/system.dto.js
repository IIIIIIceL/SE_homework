/**
 * 系统管理数据验证和规范化
 */

// ==================== 角色数据 ====================

function normalizeRoleInput(data = {}) {
  return {
    name: data.name || null,
    description: data.description || null
  };
}

function normalizeRoleQuery(query = {}) {
  return {
    keyword: query.keyword || null,
    page: query.page ? Math.max(1, Number(query.page)) : 1,
    pageSize: query.pageSize ? Math.min(100, Math.max(1, Number(query.pageSize))) : 10
  };
}

// ==================== 用户数据 ====================

function normalizeUserInput(data = {}) {
  return {
    username: data.username || null,
    passwordHash: data.passwordHash || null,
    fullName: data.fullName || null,
    roleId: data.roleId ? Number(data.roleId) : null,
    status: data.status || 'ACTIVE'
  };
}

function normalizeUserUpdate(data = {}) {
  return {
    fullName: data.fullName || undefined,
    roleId: data.roleId ? Number(data.roleId) : undefined,
    status: data.status || undefined
  };
}

function normalizeUserQuery(query = {}) {
  return {
    keyword: query.keyword || null,
    status: query.status || 'ALL',
    roleId: query.roleId ? Number(query.roleId) : null,
    page: query.page ? Math.max(1, Number(query.page)) : 1,
    pageSize: query.pageSize ? Math.min(100, Math.max(1, Number(query.pageSize))) : 10
  };
}

// ==================== 操作日志数据 ====================

function normalizeOperationLogInput(data = {}) {
  return {
    userId: data.userId ? Number(data.userId) : null,
    action: data.action || null,
    targetType: data.targetType || null,
    targetId: data.targetId ? String(data.targetId) : null,
    detail: data.detail || null,
    ipAddress: data.ipAddress || null
  };
}

function normalizeOperationLogQuery(query = {}) {
  return {
    userId: query.userId ? Number(query.userId) : null,
    action: query.action || null,
    targetType: query.targetType || null,
    keyword: query.keyword || null,
    days: query.days ? Math.max(1, Number(query.days)) : 7,
    page: query.page ? Math.max(1, Number(query.page)) : 1,
    pageSize: query.pageSize ? Math.min(100, Math.max(1, Number(query.pageSize))) : 10
  };
}

// ==================== 密码相关数据 ====================

function normalizePasswordChange(data = {}) {
  return {
    oldPassword: data.oldPassword || null,
    newPassword: data.newPassword || null,
    confirmPassword: data.confirmPassword || null
  };
}

function normalizePasswordReset(data = {}) {
  return {
    newPassword: data.newPassword || null,
    confirmPassword: data.confirmPassword || null
  };
}

module.exports = {
  normalizeRoleInput,
  normalizeRoleQuery,
  normalizeUserInput,
  normalizeUserUpdate,
  normalizeUserQuery,
  normalizeOperationLogInput,
  normalizeOperationLogQuery,
  normalizePasswordChange,
  normalizePasswordReset
};
