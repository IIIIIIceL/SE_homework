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

  useEffect(() => { loadRoles(); }, [page, appliedKeyword]);

  async function loadRoles() {
    setLoading(true);
    setError('');
    try { const result = await systemService.getRoles({ page, pageSize, keyword: appliedKeyword }); setRoles(result.data); setTotal(result.pagination.total); } catch (requestError) { setError(requestError.response?.data?.message || '加载角色失败'); } finally { setLoading(false); }
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setError('');
    try { if (editingRole?.id) await systemService.updateRole(editingRole.id, payload); else await systemService.createRole(payload); setEditingRole(null); await loadRoles(); } catch (requestError) { setError(requestError.response?.data?.message || '保存角色失败'); } finally { setSubmitting(false); }
  }

  async function handleDelete(roleId) { if (!window.confirm('确定删除该角色吗？')) return; try { await systemService.deleteRole(roleId); await loadRoles(); } catch (requestError) { setError(requestError.response?.data?.message || '删除角色失败'); } }

  return (
    <div className={styles.page}>
      <div className={styles.header}><div><h2>角色管理</h2><p className={styles.subtle}>创建和维护系统用户使用的访问角色。</p></div></div>
      <div className={styles.split}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.sectionTitle}>角色列表</h3></div>
          <form className={styles.filterBar} onSubmit={(event) => { event.preventDefault(); setPage(1); setAppliedKeyword(keyword); }}><input className={styles.input} value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索角色名称或描述" /><button type="submit" className={styles.btn}>搜索</button></form>
          {error ? <div className={styles.error}>{error}</div> : null}
          {loading ? <div className={styles.loading}>正在加载角色...</div> : roles.length === 0 ? <div className={styles.empty}>暂无角色</div> : <table className={styles.table}><thead><tr><th>名称</th><th>描述</th><th>用户数</th><th>操作</th></tr></thead><tbody>{roles.map((role) => <tr key={role.id}><td>{role.name}</td><td>{role.description || '-'}</td><td>{role.userCount}</td><td className={styles.actions}><button className={styles.linkBtn} onClick={() => setEditingRole(role)}>编辑</button><button className={`${styles.linkBtn} ${styles.danger}`} onClick={() => handleDelete(role.id)}>删除</button></td></tr>)}</tbody></table>}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </section>
        <section className={styles.panel}><div className={styles.panelHeader}><h3 className={styles.sectionTitle}>{editingRole?.id ? '编辑角色' : '创建角色'}</h3></div><RoleForm mode={editingRole?.id ? 'edit' : 'create'} initialData={editingRole} onSubmit={handleSubmit} onCancel={() => setEditingRole(null)} submitting={submitting} /></section>
      </div>
    </div>
  );
}
