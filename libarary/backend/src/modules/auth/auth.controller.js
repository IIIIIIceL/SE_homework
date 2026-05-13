const {
  login,
  register,
  getCurrentUser,
  verifyAuthToken,
  logout
} = require('./auth.service');

function handleError(res, error) {
  const message = error && error.message ? error.message : '服务异常';

  switch (error && error.code) {
    case 'MISSING_FIELDS':
    case 'INVALID_PASSWORD':
    case 'WEAK_PASSWORD':
    case 'INVALID_CREDENTIALS':
    case 'USER_INACTIVE':
    case 'DUPLICATE_USERNAME':
    case 'INVALID_TOKEN':
    case 'NO_TOKEN':
      return res.status(400).json({ message });
    case 'ROLE_NOT_FOUND':
    case 'USER_NOT_FOUND':
      return res.status(404).json({ message });
    default:
      return res.status(500).json({ message: '服务异常' });
  }
}

/**
 * 用户登录
 */
async function postLogin(req, res) {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 用户注册
 */
async function postRegister(req, res) {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 获取当前用户信息
 */
async function getCurrentUserInfo(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const user = await getCurrentUser(token);
    res.json({ data: user });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 验证令牌
 */
async function verifyToken(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decoded = verifyAuthToken(token);
    res.json({ data: decoded, valid: true });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * 用户登出
 */
async function postLogout(req, res) {
  try {
    const result = logout(req.user?.id);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  postLogin,
  postRegister,
  getCurrentUserInfo,
  verifyToken,
  postLogout
};
