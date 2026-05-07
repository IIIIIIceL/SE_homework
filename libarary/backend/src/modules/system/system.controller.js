const {
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
} = require('./system.service');

function handleError(res, error) {
  const message = error && error.message ? error.message : '服务异常';

  switch (error && error.code) {
    case 'INVALID_ID':
      return res.status(400).json({ message });
    case 'MISSING_FIELDS':
    case 'INVALID_STATUS':
    case 'DUPLICATE_ROLE':
    case 'DUPLICATE_USERNAME':
    case 'ROLE_IN_USE':
      return res.status(400).json({ message });
    case 'ROLE_NOT_FOUND':
    case 'USER_NOT_FOUND':
    case 'LOG_NOT_FOUND':
      return res.status(404).json({ message });
    default:
      return res.status(500).json({ message: '服务异常' });
  }
}

// ==================== 角色管理接口 ====================

async function getRoles(req, res) {
  try {
    const result = await listRoles(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function getRoleById(req, res) {
  try {
    const result = await getRole(req.params.roleId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function postRole(req, res) {
  try {
    const result = await createRole(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function putRole(req, res) {
  try {
    const result = await updateRole(req.params.roleId, req.body);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function deleteRoleById(req, res) {
  try {
    const result = await deleteRole(req.params.roleId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

// ==================== 用户管理接口 ====================

async function getUsers(req, res) {
  try {
    const result = await listUsers(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function getUserById(req, res) {
  try {
    const result = await getUser(req.params.userId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function postUser(req, res) {
  try {
    const result = await createUser(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function putUser(req, res) {
  try {
    const result = await updateUser(req.params.userId, req.body);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function deleteUserById(req, res) {
  try {
    const result = await deleteUser(req.params.userId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function patchUserStatus(req, res) {
  try {
    const { status } = req.body;
    const result = await changeUserStatus(req.params.userId, status);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

// ==================== 操作日志接口 ====================

async function getLogs(req, res) {
  try {
    const result = await listOperationLogs(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function getLogById(req, res) {
  try {
    const result = await getOperationLog(req.params.logId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function getUserLogs(req, res) {
  try {
    const result = await getUserOperationLogs(req.params.userId, req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function recordLog(req, res) {
  try {
    const result = await recordOperationLog(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  // 角色管理
  getRoles,
  getRoleById,
  postRole,
  putRole,
  deleteRoleById,
  // 用户管理
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUserById,
  patchUserStatus,
  // 操作日志
  getLogs,
  getLogById,
  getUserLogs,
  recordLog
};
