/**
 * 系统认证功能
 * 包含登录、验证等功能
 */

const { userRepository } = require('./system.repository');
const { toUserVO, toUserSimpleVO } = require('./vo/system.vo');

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

/**
 * 用户登录
 * 注意：实际应用中应使用bcrypt等加密库
 * 这里仅提供接口框架，具体实现需集成密码加密库
 */
async function login(username, password) {
  if (!username || username.trim() === '') {
    throw createError('MISSING_FIELDS', '用户名不能为空');
  }

  if (!password || password.trim() === '') {
    throw createError('MISSING_FIELDS', '密码不能为空');
  }

  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw createError('INVALID_CREDENTIALS', '用户名或密码错误');
  }

  if (user.status !== 'ACTIVE') {
    throw createError('USER_DISABLED', '用户已被禁用');
  }

  // TODO: 使用bcrypt验证密码
  // const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  // if (!passwordMatches) {
  //   throw createError('INVALID_CREDENTIALS', '用户名或密码错误');
  // }

  // 简单的密码验证（仅用于演示，不安全）
  if (user.passwordHash !== password && user.passwordHash !== hashPassword(password)) {
    throw createError('INVALID_CREDENTIALS', '用户名或密码错误');
  }

  // 更新最后登录时间
  await userRepository.updateLastLogin(user.id);

  return toUserVO(user);
}

/**
 * 简单的密码哈希函数（示例用）
 * 实际应该使用bcrypt等专业库
 */
function hashPassword(password) {
  // 这是一个简单的演示实现
  // 实际应用必须使用bcrypt.hash()
  return Buffer.from(password).toString('base64');
}

/**
 * 验证密码
 * 实际应该使用bcrypt.compare()
 */
function verifyPassword(plainPassword, hashedPassword) {
  // 简单的演示实现
  // 实际应用必须使用bcrypt.compare()
  return hashedPassword === plainPassword || 
         hashedPassword === hashPassword(plainPassword);
}

module.exports = {
  login,
  hashPassword,
  verifyPassword
};
