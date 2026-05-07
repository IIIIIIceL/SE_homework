/**
 * 认证响应对象(VO)
 */

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
    createdAt: user.createdAt
  };
}

function toLoginResponseVO(user, token, refreshToken) {
  return {
    user: toUserVO(user),
    token,
    refreshToken,
    expiresIn: '7d',
    tokenType: 'Bearer'
  };
}

function toCurrentUserVO(decoded) {
  if (!decoded) return null;

  return {
    id: decoded.id,
    username: decoded.username,
    fullName: decoded.fullName,
    role: decoded.role,
    status: decoded.status
  };
}

module.exports = {
  toUserVO,
  toLoginResponseVO,
  toCurrentUserVO
};
