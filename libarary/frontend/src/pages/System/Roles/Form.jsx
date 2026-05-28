import { useEffect, useState } from 'react';
import styles from '../System.module.css';

export default function RoleForm({ mode = 'create', initialData, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialData ? { name: initialData.name || '', description: initialData.description || '' } : { name: '', description: '' });
    setErrors({});
  }, [initialData]);

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); if (errors[field]) setErrors((current) => ({ ...current, [field]: '' })); }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = '角色名称不能为空';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await onSubmit({ name: form.name.trim(), description: form.description.trim() || undefined });
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.field}><label>角色名称</label><input className={styles.input} value={form.name} onChange={(event) => update('name', event.target.value)} />{errors.name ? <span className={styles.fieldError}>{errors.name}</span> : null}</div>
      <div className={styles.field}><label>角色描述</label><textarea className={styles.textarea} rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} /></div>
      <div className={styles.actions}><button type="button" className={styles.btn} onClick={onCancel}>取消</button><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? '保存中...' : mode === 'create' ? '创建角色' : '保存角色'}</button></div>
    </form>
  );
}
