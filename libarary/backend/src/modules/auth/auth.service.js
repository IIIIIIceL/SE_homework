const { prisma } = require('../../config/database');
const authRepository = require('./auth.repository');
const { normalizeLoginInput, normalizeRegisterInput } = require('./dto/auth.dto');
const { toUserVO, toLoginResponseVO, toCurrentUserVO } = require('./vo/auth.vo');
const { generateToken, verifyToken } = require('../../common/utils/jwt');
const { hashPassword, verifyPassword, validatePasswordStrength } = require('../../common/utils/password');

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

/**
 * 用户登录
 */
async function login(data) {
  const input = normalizeLoginInput(data);

  if (!input.username || input.username.trim() === '') {
    throw createError('MISSING_FIELDS', '用户名不能为空');
  }

  if (!input.password || input.password.trim() === '') {
    throw createError('MISSING_FIELDS', '密码不能为空');
  }

  // 查找用户
  const user = await authRepository.findByUsername(input.username);
  if (!user) {
    throw createError('INVALID_CREDENTIALS', '用户名或密码错误');
  }

  // 检查用户状态
  if (user.status !== 'ACTIVE') {
    const statusText = user.status === 'DELETED' ? '已删除' : '已禁用';
    throw createError('USER_INACTIVE', `用户已${statusText}`);
  }

  // 验证密码
  const passwordValid = verifyPassword(input.password, user.passwordHash);
  if (!passwordValid) {
    throw createError('INVALID_CREDENTIALS', '用户名或密码错误');
  }

  // 生成JWT令牌
  const token = generateToken({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role?.name || 'user',
    status: user.status
  });

  // 生成刷新令牌（可选，这里简单处理）
  const refreshToken = generateToken(
    { id: user.id, type: 'refresh' },
    { expiresIn: '30d' }
  );

  // 更新最后登录时间
  await authRepository.updateLastLogin(user.id);

  return toLoginResponseVO(user, token, refreshToken);
}

/**
 * 用户注册
 */
async function register(data) {
  const input = normalizeRegisterInput(data);

  // 验证必填字段
  if (!input.username || input.username.trim() === '') {
    throw createError('MISSING_FIELDS', '用户名不能为空');
  }

  if (!input.password || input.password.trim() === '') {
    throw createError('MISSING_FIELDS', '密码不能为空');
  }

  if (input.password !== input.confirmPassword) {
    throw createError('INVALID_PASSWORD', '两次输入的密码不一致');
  }

  if (!input.fullName || input.fullName.trim() === '') {
    throw createError('MISSING_FIELDS', '真实名称不能为空');
  }

  // 验证密码强度
  const pwdValidation = validatePasswordStrength(input.password);
  if (!pwdValidation.isValid) {
    throw createError('WEAK_PASSWORD', pwdValidation.errors.join(', '));
  }

  // 检查用户名是否已存在
  const existingUser = await authRepository.findByUsername(input.username);
  if (existingUser) {
    throw createError('DUPLICATE_USERNAME', '用户名已存在');
  }

  // 如果指定了角色，验证角色是否存在
  let roleId = input.roleId;
  if (!roleId) {
    // 使用默认角色（假设有一个id=1的default role）
    const defaultRole = await prisma.role.findFirst({
      where: { name: 'user' }
    });
    roleId = defaultRole?.id || 1;
  } else {
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });
    if (!role) {
      throw createError('ROLE_NOT_FOUND', '角色不存在');
    }
  }

  // 创建用户
  const hashedPassword = hashPassword(input.password);
  const user = await authRepository.create({
    username: input.username,
    passwordHash: hashedPassword,
    fullName: input.fullName,
    roleId,
    status: 'ACTIVE'
  });

  // 生成令牌
  const token = generateToken({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role?.name || 'user',
    status: user.status
  });

  const refreshToken = generateToken(
    { id: user.id, type: 'refresh' },
    { expiresIn: '30d' }
  );

  return toLoginResponseVO(user, token, refreshToken);
}

/**
 * 获取当前用户信息（从令牌中）
 */
async function getCurrentUser(token) {
  if (!token) {
    throw createError('NO_TOKEN', '缺少认证令牌');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw createError('INVALID_TOKEN', '令牌无效或已过期');
  }

  // 从数据库重新获取最新的用户信息
  const user = await authRepository.findById(decoded.id);
  if (!user) {
    throw createError('USER_NOT_FOUND', '用户不存在');
  }

  return toCurrentUserVO(decoded);
}

/**
 * 验证令牌
 */
function verifyAuthToken(token) {
  if (!token) {
    throw createError('NO_TOKEN', '缺少认证令牌');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw createError('INVALID_TOKEN', '令牌无效或已过期');
  }

  return decoded;
}

/**
 * 登出（客户端丢弃令牌即可）
 */
function logout(userId) {
  // JWT是无状态的，登出只需要客户端丢弃令牌
  // 可选：可以在服务器端维护黑名单，但个人项目级别不需要
  return {
    message: '登出成功'
  };
}

module.exports = {
  login,
  register,
  getCurrentUser,
  verifyAuthToken,
  logout
};
