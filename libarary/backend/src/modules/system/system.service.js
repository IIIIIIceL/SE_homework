const { prisma } = require('../../config/database');
const { roleRepository, userRepository, operationLogRepository } = require('./system.repository');
const {
  normalizeRoleInput,
  normalizeRoleQuery,
  normalizeUserInput,
  normalizeUserUpdate,
  normalizeUserQuery,
  normalizeOperationLogInput,
  normalizeOperationLogQuery
} = require('./dto/system.dto');
const {
  toRoleVO,
  toRoleListVO,
  toUserVO,
  toUserListVO,
  toOperationLogVO,
  toOperationLogListVO
} = require('./vo/system.vo');

const USER_STATUSES = new Set(['ACTIVE', 'DISABLED']);

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// ==================== 角色管理 ====================

async function createRole(data) {
  const input = normalizeRoleInput(data);

  if (!input.name || input.name.trim() === '') {
    throw createError('MISSING_FIELDS', '角色名称不能为空');
  }

  // 检查角色是否已存在
  const existingRole = await roleRepository.findByName(input.name);
  if (existingRole) {
    throw createError('DUPLICATE_ROLE', '角色已存在');
  }

  const role = await roleRepository.create(input);
  return toRoleVO(role);
}

async function updateRole(roleId, data) {
  const id = Number(roleId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '角色编号不合法');
  }

  const input = normalizeRoleInput(data);

  // 验证角色存在
  const role = await roleRepository.findById(id);
  if (!role) {
    throw createError('ROLE_NOT_FOUND', '角色不存在');
  }

  // 如果修改了角色名，需要检查是否重复
  if (input.name && input.name !== role.name) {
    const existingRole = await roleRepository.findByName(input.name);
    if (existingRole) {
      throw createError('DUPLICATE_ROLE', '角色名称已存在');
    }
  }

  const updated = await roleRepository.update(id, input);
  return toRoleVO(updated);
}

async function deleteRole(roleId) {
  const id = Number(roleId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '角色编号不合法');
  }

  const role = await roleRepository.findById(id);
  if (!role) {
    throw createError('ROLE_NOT_FOUND', '角色不存在');
  }

  // 检查是否有用户使用该角色
  if (role.users && role.users.length > 0) {
    throw createError('ROLE_IN_USE', '该角色已被使用，不能删除');
  }

  const deleted = await roleRepository.delete(id);
  return toRoleVO(deleted);
}

async function getRole(roleId) {
  const id = Number(roleId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '角色编号不合法');
  }

  const role = await roleRepository.findById(id);
  if (!role) {
    throw createError('ROLE_NOT_FOUND', '角色不存在');
  }

  return toRoleVO(role);
}

async function listRoles(query) {
  const params = normalizeRoleQuery(query);
  const [items, total] = await roleRepository.list(params);

  return {
    data: toRoleListVO(items),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

// ==================== 用户管理 ====================

async function createUser(data) {
  const input = normalizeUserInput(data);

  // 验证必填字段
  if (!input.username || input.username.trim() === '') {
    throw createError('MISSING_FIELDS', '用户名不能为空');
  }

  if (!input.passwordHash || input.passwordHash.trim() === '') {
    throw createError('MISSING_FIELDS', '密码不能为空');
  }

  if (!input.fullName || input.fullName.trim() === '') {
    throw createError('MISSING_FIELDS', '用户名称不能为空');
  }

  if (!input.roleId) {
    throw createError('MISSING_FIELDS', '角色不能为空');
  }

  // 检查用户名是否已存在
  const existingUser = await userRepository.findByUsername(input.username);
  if (existingUser) {
    throw createError('DUPLICATE_USERNAME', '用户名已存在');
  }

  // 检查角色是否存在
  const role = await roleRepository.findById(input.roleId);
  if (!role) {
    throw createError('ROLE_NOT_FOUND', '角色不存在');
  }

  const user = await userRepository.create(input);
  return toUserVO(user);
}

async function updateUser(userId, data) {
  const id = Number(userId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '用户编号不合法');
  }

  const input = normalizeUserUpdate(data);

  // 验证用户存在
  const user = await userRepository.findById(id);
  if (!user) {
    throw createError('USER_NOT_FOUND', '用户不存在');
  }

  // 验证状态值
  if (input.status && !USER_STATUSES.has(input.status)) {
    throw createError('INVALID_STATUS', '用户状态不合法');
  }

  // 如果修改了角色，需要检查角色是否存在
  if (input.roleId) {
    const role = await roleRepository.findById(input.roleId);
    if (!role) {
      throw createError('ROLE_NOT_FOUND', '角色不存在');
    }
  }

  // 移除undefined的字段
  Object.keys(input).forEach(key => input[key] === undefined && delete input[key]);

  const updated = await userRepository.update(id, input);
  return toUserVO(updated);
}

async function deleteUser(userId) {
  const id = Number(userId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '用户编号不合法');
  }

  const user = await userRepository.findById(id);
  if (!user) {
    throw createError('USER_NOT_FOUND', '用户不存在');
  }

  const deleted = await userRepository.delete(id);
  return toUserVO(deleted);
}

async function getUser(userId) {
  const id = Number(userId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '用户编号不合法');
  }

  const user = await userRepository.findById(id);
  if (!user) {
    throw createError('USER_NOT_FOUND', '用户不存在');
  }

  return toUserVO(user);
}

async function listUsers(query) {
  const params = normalizeUserQuery(query);
  const [items, total] = await userRepository.list(params);

  return {
    data: toUserListVO(items),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

async function changeUserStatus(userId, status) {
  const id = Number(userId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '用户编号不合法');
  }

  if (!USER_STATUSES.has(status)) {
    throw createError('INVALID_STATUS', '用户状态不合法');
  }

  const user = await userRepository.findById(id);
  if (!user) {
    throw createError('USER_NOT_FOUND', '用户不存在');
  }

  const updated = await userRepository.update(id, { status });
  return toUserVO(updated);
}

// ==================== 操作日志 ====================

async function recordOperationLog(data) {
  const input = normalizeOperationLogInput(data);

  if (!input.action || input.action.trim() === '') {
    throw createError('MISSING_FIELDS', '操作类型不能为空');
  }

  const log = await operationLogRepository.create(input);
  return toOperationLogVO(log);
}

async function getOperationLog(logId) {
  const id = Number(logId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '日志编号不合法');
  }

  const log = await operationLogRepository.findById(id);
  if (!log) {
    throw createError('LOG_NOT_FOUND', '操作日志不存在');
  }

  return toOperationLogVO(log);
}

async function listOperationLogs(query) {
  const params = normalizeOperationLogQuery(query);
  const [items, total] = await operationLogRepository.list(params);

  return {
    data: toOperationLogListVO(items),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

async function getUserOperationLogs(userId, query) {
  const uid = Number(userId);
  if (Number.isNaN(uid)) {
    throw createError('INVALID_ID', '用户编号不合法');
  }

  // 验证用户存在
  const user = await userRepository.findById(uid);
  if (!user) {
    throw createError('USER_NOT_FOUND', '用户不存在');
  }

  const params = normalizeOperationLogQuery(query);
  const [items, total] = await operationLogRepository.getByUser(uid, params);

  return {
    data: toOperationLogListVO(items),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

module.exports = {
  // 角色管理
  createRole,
  updateRole,
  deleteRole,
  getRole,
  listRoles,
  // 用户管理
  createUser,
  updateUser,
  deleteUser,
  getUser,
  listUsers,
  changeUserStatus,
  // 操作日志
  recordOperationLog,
  getOperationLog,
  listOperationLogs,
  getUserOperationLogs
};
