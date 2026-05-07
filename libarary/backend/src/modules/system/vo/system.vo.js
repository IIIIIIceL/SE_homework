/**
 * 系统管理视图对象(VO)
 */

// ==================== 角色VO ====================

function toRoleVO(role) {
  if (!role) return null;

  return {
    id: role.id,
    name: role.name,
    description: role.description,
    userCount: role.users ? role.users.length : 0,
    users: role.users ? role.users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      status: user.status
    })) : []
  };
}

function toRoleListVO(roles) {
  if (!Array.isArray(roles)) return [];
  return roles.map(toRoleVO);
}

// ==================== 用户VO ====================

function toUserVO(user) {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role ? {
      id: user.role.id,
      name: user.role.name
    } : null,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function toUserListVO(users) {
  if (!Array.isArray(users)) return [];
  return users.map(toUserVO);
}

function toUserSimpleVO(user) {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    status: user.status
  };
}

// ==================== 操作日志VO ====================

function toOperationLogVO(log) {
  if (!log) return null;

  return {
    id: log.id,
    user: log.user ? {
      id: log.user.id,
      username: log.user.username,
      fullName: log.user.fullName
    } : null,
    action: log.action,
    targetType: log.targetType,
    targetId: log.targetId,
    detail: log.detail,
    ipAddress: log.ipAddress,
    createdAt: log.createdAt
  };
}

function toOperationLogListVO(logs) {
  if (!Array.isArray(logs)) return [];
  return logs.map(toOperationLogVO);
}

module.exports = {
  toRoleVO,
  toRoleListVO,
  toUserVO,
  toUserListVO,
  toUserSimpleVO,
  toOperationLogVO,
  toOperationLogListVO
};
