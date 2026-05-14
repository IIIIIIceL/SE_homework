import { useEffect, useState } from 'react';
import Pagination from '../../../components/Pagination';
import { systemService } from '../../../services/systemService';
import UserForm from './Form';
import styles from '../System.module.css';

const STATUS_LABELS = { ACTIVE: '正常', DISABLED: '停用', DELETED: '已删除' };
const STATUS_CLASS_NAMES = { ACTIVE: 'statusActive', DISABLED: 'statusDisabled', DELETED: 'statusDeleted' };

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

  useEffect(() => { loadUsers(); }, [page, appliedKeyword, status, roleId]);
  useEffect(() => { systemService.getRoles({ page: 1, pageSize: 100 }).then((result) => setRoles(result.data)).catch(() => setRoles([])); }, []);

  async function loadUsers() {
    setLoading(true);
    setError('');
    try { const result = await systemService.getUsers({ page, pageSize, keyword: appliedKeyword, status, roleId: roleId || undefined }); setUsers(result.data); setTotal(result.pagination.total); } catch (requestError) { setError(requestError.response?.data?.message || '加载用户失败'); } finally { setLoading(false); }
  }
  async function handleSubmit(payload) { setSubmitting(true); setError(''); try { if (editingUser?.id) await systemService.updateUser(editingUser.id, payload); else await systemService.createUser(payload); setEditingUser(null); await loadUsers(); } catch (requestError) { setError(requestError.response?.data?.message || '保存用户失败'); } finally { setSubmitting(false); } }
  async function handleStatusChange(user, nextStatus) { try { await systemService.updateUserStatus(user.id, nextStatus); await loadUsers(); } catch (requestError) { setError(requestError.response?.data?.message || '更新用户状态失败'); } }
  async function handleDelete(userId) { if (!window.confirm('确定将该用户标记为已删除吗？')) return; try { await systemService.deleteUser(userId); await loadUsers(); } catch (requestError) { setError(requestError.response?.data?.message || '删除用户失败'); } }
  async function handleRestore(userId) { try { await systemService.restoreUser(userId); await loadUsers(); } catch (requestError) { setError(requestError.response?.data?.message || '恢复用户失败'); } }
  async function handleResetPassword(userId) { const newPassword = window.prompt('请输入该用户的新密码：'); if (!newPassword) return; try { await systemService.resetUserPassword(userId, newPassword); window.alert('密码已重置'); } catch (requestError) { setError(requestError.response?.data?.message || '重置密码失败'); } }

  return (
    <div className={styles.page}>
      <div className={styles.header}><div><h2>用户管理</h2><p className={styles.subtle}>创建用户、分配角色、更新状态并重置密码。</p></div></div>
      <div className={styles.split}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.sectionTitle}>用户列表</h3></div>
          <form className={styles.filterBar} onSubmit={(event) => { event.preventDefault(); setPage(1); setAppliedKeyword(keyword); }}><input className={styles.input} value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索用户名或姓名" /><select className={styles.select} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="ALL">全部状态</option><option value="ACTIVE">正常</option><option value="DISABLED">停用</option><option value="DELETED">已删除</option></select><select className={styles.select} value={roleId} onChange={(event) => { setRoleId(event.target.value); setPage(1); }}><option value="">全部角色</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select><button type="submit" className={styles.btn}>搜索</button></form>
          {error ? <div className={styles.error}>{error}</div> : null}
          {loading ? <div className={styles.loading}>正在加载用户...</div> : users.length === 0 ? <div className={styles.empty}>暂无用户</div> : <table className={styles.table}><thead><tr><th>用户名</th><th>姓名</th><th>角色</th><th>状态</th><th>最后登录</th><th>操作</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.username}</td><td>{user.fullName}</td><td>{user.role?.name || '-'}</td><td><span className={styles[STATUS_CLASS_NAMES[user.status] || 'statusDisabled']}>{STATUS_LABELS[user.status] || user.status}</span></td><td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-'}</td><td className={styles.actions}><button className={styles.linkBtn} onClick={() => setEditingUser(user)}>编辑</button>{user.status !== 'DELETED' ? <button className={styles.linkBtn} onClick={() => handleStatusChange(user, user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE')}>{user.status === 'ACTIVE' ? '停用' : '启用'}</button> : <button className={styles.linkBtn} onClick={() => handleRestore(user.id)}>恢复</button>}<button className={styles.linkBtn} onClick={() => handleResetPassword(user.id)}>重置密码</button>{user.status !== 'DELETED' ? <button className={`${styles.linkBtn} ${styles.danger}`} onClick={() => handleDelete(user.id)}>删除</button> : null}</td></tr>)}</tbody></table>}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </section>
        <section className={styles.panel}><div className={styles.panelHeader}><h3 className={styles.sectionTitle}>{editingUser?.id ? '编辑用户' : '创建用户'}</h3></div><UserForm mode={editingUser?.id ? 'edit' : 'create'} initialData={editingUser} roles={roles} onSubmit={handleSubmit} onCancel={() => setEditingUser(null)} submitting={submitting} /></section>
      </div>
    </div>
  );
}
