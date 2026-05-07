/**
 * 简单的密码工具
 * 注意：在生产环境中应使用 bcrypt 加密
 * 当前实现为个人项目级别
 */

/**
 * 哈希密码（简单实现）
 * 生产环境应使用 bcrypt: npm install bcrypt
 */
function hashPassword(password) {
  // 简单实现：这里可以使用Base64编码加盐
  // 生产环境: const bcrypt = require('bcrypt');
  // return await bcrypt.hash(password, 10);
  
  // 为了兼容当前系统，使用简单的Base64编码
  // 实际应用中应该用bcrypt
  const salt = 'personal-project-salt';
  return Buffer.from(salt + password).toString('base64');
}

/**
 * 验证密码
 */
function verifyPassword(inputPassword, hashedPassword) {
  // 简单实现：直接哈希后比较
  // 生产环境: const bcrypt = require('bcrypt');
  // return await bcrypt.compare(inputPassword, hashedPassword);
  
  const salt = 'personal-project-salt';
  const inputHash = Buffer.from(salt + inputPassword).toString('base64');
  return inputHash === hashedPassword;
}

/**
 * 验证密码强度（简单）
 */
function validatePasswordStrength(password) {
  const errors = [];
  
  if (!password || password.length < 6) {
    errors.push('密码长度至少6位');
  }
  
  if (password.length > 50) {
    errors.push('密码长度不能超过50位');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  validatePasswordStrength
};
