const { verifyToken } = require('../utils/jwt');

/**
 * 身份验证中间件
 * 验证JWT令牌的有效性
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      code: 'NO_TOKEN',
      message: '缺少认证令牌'
    });
  }

  // 提取令牌（Bearer scheme）
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      code: 'INVALID_TOKEN_FORMAT',
      message: '令牌格式不合法'
    });
  }

  const token = parts[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      code: 'INVALID_TOKEN',
      message: '令牌无效或已过期'
    });
  }

  // 将用户信息保存到请求对象
  req.user = decoded;
  next();
}

/**
 * 角色检查中间件
 * 检查用户是否拥有指定的角色
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        code: 'NOT_AUTHENTICATED',
        message: '请先登录'
      });
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        code: 'INSUFFICIENT_PERMISSIONS',
        message: '您没有权限执行此操作'
      });
    }

    next();
  };
}

/**
 * 可选认证中间件
 * 如果提供了令牌则验证，没有令牌也继续
 */
function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    req.user = null;
    return next();
  }

  const token = parts[1];
  const decoded = verifyToken(token);

  if (decoded) {
    req.user = decoded;
  } else {
    req.user = null;
  }

  next();
}

module.exports = {
  authMiddleware,
  requireRole,
  optionalAuthMiddleware
};
