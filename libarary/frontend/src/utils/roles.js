export function getRoleName(user) {
  if (!user?.role) return '';
  return typeof user.role === 'string' ? user.role : user.role.name || '';
}

export function isAdminRole(roleName) {
  return roleName === 'ADMIN';
}

export function isReaderRole(roleName) {
  return roleName === 'LIBRARIAN';
}

export function getHomeRouteForUser(user) {
  return isAdminRole(getRoleName(user)) ? '/dashboard' : '/reader';
}
