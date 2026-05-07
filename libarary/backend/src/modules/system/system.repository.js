const { prisma } = require('../../config/database');

// 用户查询包含字段
const userInclude = {
  role: {
    select: {
      id: true,
      name: true,
      description: true
    }
  }
};

// 角色查询包含字段
const roleInclude = {
  users: {
    select: {
      id: true,
      username: true,
      fullName: true,
      status: true
    }
  }
};

// ==================== 角色管理 ====================

const roleRepository = {
  create(data) {
    return prisma.role.create({
      data,
      include: roleInclude
    });
  },

  findById(id) {
    return prisma.role.findUnique({
      where: { id },
      include: roleInclude
    });
  },

  findByName(name) {
    return prisma.role.findUnique({
      where: { name },
      include: roleInclude
    });
  },

  list(params = {}) {
    const { page = 1, pageSize = 10, keyword } = params;
    const skip = (page - 1) * pageSize;
    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } }
          ]
        }
      : {};

    return Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
        include: roleInclude
      }),
      prisma.role.count({ where })
    ]);
  },

  update(id, data) {
    return prisma.role.update({
      where: { id },
      data,
      include: roleInclude
    });
  },

  delete(id) {
    return prisma.role.delete({
      where: { id },
      include: roleInclude
    });
  }
};

// ==================== 用户管理 ====================

const userRepository = {
  create(data) {
    return prisma.user.create({
      data,
      include: userInclude
    });
  },

  findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: userInclude
    });
  },

  findByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
      include: userInclude
    });
  },

  list(params = {}) {
    const { page = 1, pageSize = 10, keyword, status, roleId } = params;
    const skip = (page - 1) * pageSize;
    const andClauses = [];

    if (keyword && String(keyword).trim()) {
      const search = String(keyword).trim();
      andClauses.push({
        OR: [
          { username: { contains: search } },
          { fullName: { contains: search } }
        ]
      });
    }

    if (status && status !== 'ALL') {
      andClauses.push({ status });
    }

    if (roleId) {
      andClauses.push({ roleId: Number(roleId) });
    }

    const where = andClauses.length > 0 ? { AND: andClauses } : {};

    return Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: userInclude
      }),
      prisma.user.count({ where })
    ]);
  },

  update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      include: userInclude
    });
  },

  updateLastLogin(id) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
      include: userInclude
    });
  },

  delete(id) {
    // 逻辑删除：标记为DELETED而不是物理删除
    return prisma.user.update({
      where: { id },
      data: { status: 'DELETED' },
      include: userInclude
    });
  },

  // 恢复已删除的用户
  restore(id) {
    return prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
      include: userInclude
    });
  },

  // 更新密码
  updatePassword(id, passwordHash) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      include: userInclude
    });
  },

  // 获取系统统计信息
  async getSystemStats() {
    const [totalUsers, activeUsers, disabledUsers] = await Promise.all([
      prisma.user.count({ where: { status: { notIn: ['DELETED'] } } }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'DISABLED' } })
    ]);

    const totalRoles = await prisma.role.count();
    const deletedUsers = await prisma.user.count({ where: { status: 'DELETED' } });

    return {
      totalUsers,
      activeUsers,
      disabledUsers,
      deletedUsers,
      totalRoles
    };
  },

  // 获取日志统计
  async getLogStats(days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const total = await prisma.operationLog.count({ where: { createdAt: { gte: since } } });
    const byAction = await prisma.operationLog.groupBy({
      by: ['action'],
      where: { createdAt: { gte: since } },
      _count: true
    });

    return {
      total,
      byAction: byAction.map(item => ({
        action: item.action,
        count: item._count
      }))
    };
  }
};

// ==================== 操作日志 ====================

const operationLogRepository = {
  create(data) {
    return prisma.operationLog.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
  },

  findById(id) {
    return prisma.operationLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
  },

  list(params = {}) {
    const { page = 1, pageSize = 10, userId, action, targetType, keyword } = params;
    const skip = (page - 1) * pageSize;
    const andClauses = [];

    if (userId) {
      andClauses.push({ userId: Number(userId) });
    }

    if (action) {
      andClauses.push({ action: { contains: action } });
    }

    if (targetType) {
      andClauses.push({ targetType });
    }

    if (keyword && String(keyword).trim()) {
      const search = String(keyword).trim();
      andClauses.push({
        OR: [
          { action: { contains: search } },
          { detail: { contains: search } },
          { targetType: { contains: search } }
        ]
      });
    }

    const where = andClauses.length > 0 ? { AND: andClauses } : {};

    return Promise.all([
      prisma.operationLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true
            }
          }
        }
      }),
      prisma.operationLog.count({ where })
    ]);
  },

  getByUser(userId, params = {}) {
    const { page = 1, pageSize = 10, days = 7 } = params;
    const skip = (page - 1) * pageSize;
    const since = new Date();
    since.setDate(since.getDate() - days);

    return Promise.all([
      prisma.operationLog.findMany({
        where: {
          userId,
          createdAt: { gte: since }
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true
            }
          }
        }
      }),
      prisma.operationLog.count({
        where: {
          userId,
          createdAt: { gte: since }
        }
      })
    ]);
  }
};

module.exports = {
  roleRepository,
  userRepository,
  operationLogRepository
};
