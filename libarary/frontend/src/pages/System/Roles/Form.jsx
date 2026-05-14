import { useEffect, useState } from 'react';
import styles from '../System.module.css';

export default function RoleForm({ mode = 'create', initialData, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || ''
      });
    } else {
      setForm({ name: '', description: '' });
    }
    setErrors({});
  }, [initialData]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Role name is required.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || undefined
    });
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Role Name</label>
        <input className={styles.input} value={form.name} onChange={(event) => update('name', event.target.value)} />
        {errors.name ? <span className={styles.fieldError}>{errors.name}</span> : null}
      </div>

      <div className={styles.field}>
        <label>Description</label>
        <textarea
          className={styles.textarea}
          rows={4}
          value={form.description}
          onChange={(event) => update('description', event.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? 'Saving...' : mode === 'create' ? 'Create Role' : 'Save Role'}
        </button>
      </div>
    </form>
  );
}
