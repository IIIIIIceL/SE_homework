const { prisma } = require('../../config/database');

const userInclude = {
  role: {
    select: {
      id: true,
      name: true
    }
  }
};

const authRepository = {
  /**
   * 根据用户名查找用户
   */
  findByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
      include: userInclude
    });
  },

  /**
   * 根据ID查找用户
   */
  findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: userInclude
    });
  },

  /**
   * 创建新用户
   */
  create(data) {
    return prisma.user.create({
      data,
      include: userInclude
    });
  },

  /**
   * 更新最后登录时间
   */
  updateLastLogin(id) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
      include: userInclude
    });
  }
};

module.exports = authRepository;
