import { useEffect, useState } from 'react';
import styles from '../System.module.css';

const STATUS_LABELS = { ACTIVE: '正常', DISABLED: '停用', DELETED: '已删除' };

export default function UserForm({ mode = 'create', initialData, roles, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ username: '', passwordHash: '', fullName: '', roleId: '', status: 'ACTIVE' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialData ? { username: initialData.username || '', passwordHash: '', fullName: initialData.fullName || '', roleId: initialData.role?.id || '', status: initialData.status || 'ACTIVE' } : { username: '', passwordHash: '', fullName: '', roleId: roles[0]?.id || '', status: 'ACTIVE' });
    setErrors({});
  }, [initialData, roles]);

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); if (errors[field]) setErrors((current) => ({ ...current, [field]: '' })); }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (mode === 'create' && !form.username.trim()) nextErrors.username = '用户名不能为空';
    if (mode === 'create' && !form.passwordHash.trim()) nextErrors.passwordHash = '密码不能为空';
    if (!form.fullName.trim()) nextErrors.fullName = '姓名不能为空';
    if (!form.roleId) nextErrors.roleId = '请选择角色';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const payload = { fullName: form.fullName.trim(), roleId: Number(form.roleId), status: form.status };
    if (mode === 'create') { payload.username = form.username.trim(); payload.passwordHash = form.passwordHash; }
    await onSubmit(payload);
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.field}><label>用户名</label><input className={styles.input} value={form.username} disabled={mode === 'edit'} onChange={(event) => update('username', event.target.value)} />{errors.username ? <span className={styles.fieldError}>{errors.username}</span> : null}</div>
        {mode === 'create' ? <div className={styles.field}><label>密码</label><input className={styles.input} type="password" value={form.passwordHash} onChange={(event) => update('passwordHash', event.target.value)} />{errors.passwordHash ? <span className={styles.fieldError}>{errors.passwordHash}</span> : null}</div> : null}
        <div className={styles.field}><label>姓名</label><input className={styles.input} value={form.fullName} onChange={(event) => update('fullName', event.target.value)} />{errors.fullName ? <span className={styles.fieldError}>{errors.fullName}</span> : null}</div>
        <div className={styles.field}><label>角色</label><select className={styles.select} value={form.roleId} onChange={(event) => update('roleId', event.target.value)}><option value="">请选择角色</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select>{errors.roleId ? <span className={styles.fieldError}>{errors.roleId}</span> : null}</div>
        <div className={styles.field}><label>状态</label><select className={styles.select} value={form.status} onChange={(event) => update('status', event.target.value)}>{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      </div>
      <div className={styles.actions}><button type="button" className={styles.btn} onClick={onCancel}>取消</button><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? '保存中...' : mode === 'create' ? '创建用户' : '保存用户'}</button></div>
    </form>
  );
}
