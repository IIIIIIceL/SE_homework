import { useEffect, useState } from 'react';
import Pagination from '../../../components/Pagination';
import { systemService } from '../../../services/systemService';
import UserForm from './Form';
import styles from '../System.module.css';

const STATUS_LABELS = {
  ACTIVE: 'Active',
  DISABLED: 'Disabled',
  DELETED: 'Deleted'
};

const STATUS_CLASS_NAMES = {
  ACTIVE: 'statusActive',
  DISABLED: 'statusDisabled',
  DELETED: 'statusDeleted'
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [status, setStatus] = useState('ALL');
  const [roleId, setRoleId] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const pageSize = 10;

  useEffect(() => {
    loadUsers();
  }, [page, appliedKeyword, status, roleId]);

  useEffect(() => {
    systemService.getRoles({ page: 1, pageSize: 100 }).then((result) => setRoles(result.data)).catch(() => setRoles([]));
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      const result = await systemService.getUsers({
        page,
        pageSize,
        keyword: appliedKeyword,
        status,
        roleId: roleId || undefined
      });
      setUsers(result.data);
      setTotal(result.pagination.total);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setError('');
    try {
      if (editingUser?.id) {
        await systemService.updateUser(editingUser.id, payload);
      } else {
        await systemService.createUser(payload);
      }
      setEditingUser(null);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to save user.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(user, nextStatus) {
    try {
      await systemService.updateUserStatus(user.id, nextStatus);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to update user status.');
    }
  }

  async function handleDelete(userId) {
    if (!window.confirm('Mark this user as deleted?')) return;
    try {
      await systemService.deleteUser(userId);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete user.');
    }
  }

  async function handleRestore(userId) {
    try {
      await systemService.restoreUser(userId);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to restore user.');
    }
  }

  async function handleResetPassword(userId) {
    const newPassword = window.prompt('Enter a new password for this user:');
    if (!newPassword) return;

    try {
      await systemService.resetUserPassword(userId, newPassword);
      window.alert('Password has been reset.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to reset password.');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>User Management</h2>
          <p className={styles.subtle}>Create users, assign roles, update status and reset passwords.</p>
        </div>
      </div>

      <div className={styles.split}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.sectionTitle}>Users</h3>
          </div>

          <form
            className={styles.filterBar}
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setAppliedKeyword(keyword);
            }}
          >
            <input
              className={styles.input}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by username or full name"
            />
            <select className={styles.select} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
              <option value="DELETED">Deleted</option>
            </select>
            <select className={styles.select} value={roleId} onChange={(event) => { setRoleId(event.target.value); setPage(1); }}>
              <option value="">All roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <button type="submit" className={styles.btn}>Search</button>
          </form>

          {error ? <div className={styles.error}>{error}</div> : null}

          {loading ? (
            <div className={styles.loading}>Loading users...</div>
          ) : users.length === 0 ? (
            <div className={styles.empty}>No users found.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.role?.name || '-'}</td>
                    <td>
                      <span className={styles[STATUS_CLASS_NAMES[user.status] || 'statusDisabled']}>
                        {STATUS_LABELS[user.status] || user.status}
                      </span>
                    </td>
                    <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-'}</td>
                    <td className={styles.actions}>
                      <button className={styles.linkBtn} onClick={() => setEditingUser(user)}>Edit</button>
                      {user.status !== 'DELETED' ? (
                        <button
                          className={styles.linkBtn}
                          onClick={() => handleStatusChange(user, user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE')}
                        >
                          {user.status === 'ACTIVE' ? 'Disable' : 'Activate'}
                        </button>
                      ) : (
                        <button className={styles.linkBtn} onClick={() => handleRestore(user.id)}>Restore</button>
                      )}
                      <button className={styles.linkBtn} onClick={() => handleResetPassword(user.id)}>Reset Password</button>
                      {user.status !== 'DELETED' ? (
                        <button className={`${styles.linkBtn} ${styles.danger}`} onClick={() => handleDelete(user.id)}>Delete</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.sectionTitle}>{editingUser?.id ? 'Edit User' : 'Create User'}</h3>
          </div>
          <UserForm
            mode={editingUser?.id ? 'edit' : 'create'}
            initialData={editingUser}
            roles={roles}
            onSubmit={handleSubmit}
            onCancel={() => setEditingUser(null)}
            submitting={submitting}
          />
        </section>
      </div>
    </div>
  );
}
