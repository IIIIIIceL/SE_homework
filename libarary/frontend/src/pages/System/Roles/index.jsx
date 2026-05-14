import { useEffect, useState } from 'react';
import Pagination from '../../../components/Pagination';
import { systemService } from '../../../services/systemService';
import RoleForm from './Form';
import styles from '../System.module.css';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    loadRoles();
  }, [page, appliedKeyword]);

  async function loadRoles() {
    setLoading(true);
    setError('');
    try {
      const result = await systemService.getRoles({ page, pageSize, keyword: appliedKeyword });
      setRoles(result.data);
      setTotal(result.pagination.total);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load roles.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setError('');
    try {
      if (editingRole?.id) {
        await systemService.updateRole(editingRole.id, payload);
      } else {
        await systemService.createRole(payload);
      }
      setEditingRole(null);
      await loadRoles();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to save role.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(roleId) {
    if (!window.confirm('Delete this role?')) return;
    try {
      await systemService.deleteRole(roleId);
      await loadRoles();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete role.');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Role Management</h2>
          <p className={styles.subtle}>Create and maintain access roles used by system users.</p>
        </div>
      </div>

      <div className={styles.split}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.sectionTitle}>Roles</h3>
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
              placeholder="Search by role name or description"
            />
            <button type="submit" className={styles.btn}>Search</button>
          </form>

          {error ? <div className={styles.error}>{error}</div> : null}

          {loading ? (
            <div className={styles.loading}>Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className={styles.empty}>No roles found.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Users</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>{role.description || '-'}</td>
                    <td>{role.userCount}</td>
                    <td className={styles.actions}>
                      <button className={styles.linkBtn} onClick={() => setEditingRole(role)}>Edit</button>
                      <button className={`${styles.linkBtn} ${styles.danger}`} onClick={() => handleDelete(role.id)}>Delete</button>
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
            <h3 className={styles.sectionTitle}>{editingRole?.id ? 'Edit Role' : 'Create Role'}</h3>
          </div>
          <RoleForm
            mode={editingRole?.id ? 'edit' : 'create'}
            initialData={editingRole}
            onSubmit={handleSubmit}
            onCancel={() => setEditingRole(null)}
            submitting={submitting}
          />
        </section>
      </div>
    </div>
  );
}
