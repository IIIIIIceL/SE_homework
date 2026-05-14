import { useEffect, useState } from 'react';
import styles from '../System.module.css';

export default function UserForm({
  mode = 'create',
  initialData,
  roles,
  onSubmit,
  onCancel,
  submitting
}) {
  const [form, setForm] = useState({
    username: '',
    passwordHash: '',
    fullName: '',
    roleId: '',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        username: initialData.username || '',
        passwordHash: '',
        fullName: initialData.fullName || '',
        roleId: initialData.role?.id || '',
        status: initialData.status || 'ACTIVE'
      });
    } else {
      setForm({
        username: '',
        passwordHash: '',
        fullName: '',
        roleId: roles[0]?.id || '',
        status: 'ACTIVE'
      });
    }
    setErrors({});
  }, [initialData, roles]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (mode === 'create' && !form.username.trim()) nextErrors.username = 'Username is required.';
    if (mode === 'create' && !form.passwordHash.trim()) nextErrors.passwordHash = 'Password is required.';
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.roleId) nextErrors.roleId = 'Role is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      fullName: form.fullName.trim(),
      roleId: Number(form.roleId),
      status: form.status
    };

    if (mode === 'create') {
      payload.username = form.username.trim();
      payload.passwordHash = form.passwordHash;
    }

    await onSubmit(payload);
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Username</label>
          <input
            className={styles.input}
            value={form.username}
            disabled={mode === 'edit'}
            onChange={(event) => update('username', event.target.value)}
          />
          {errors.username ? <span className={styles.fieldError}>{errors.username}</span> : null}
        </div>

        {mode === 'create' ? (
          <div className={styles.field}>
            <label>Password</label>
            <input
              className={styles.input}
              type="password"
              value={form.passwordHash}
              onChange={(event) => update('passwordHash', event.target.value)}
            />
            {errors.passwordHash ? <span className={styles.fieldError}>{errors.passwordHash}</span> : null}
          </div>
        ) : null}

        <div className={styles.field}>
          <label>Full Name</label>
          <input className={styles.input} value={form.fullName} onChange={(event) => update('fullName', event.target.value)} />
          {errors.fullName ? <span className={styles.fieldError}>{errors.fullName}</span> : null}
        </div>

        <div className={styles.field}>
          <label>Role</label>
          <select className={styles.select} value={form.roleId} onChange={(event) => update('roleId', event.target.value)}>
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          {errors.roleId ? <span className={styles.fieldError}>{errors.roleId}</span> : null}
        </div>

        <div className={styles.field}>
          <label>Status</label>
          <select className={styles.select} value={form.status} onChange={(event) => update('status', event.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
            <option value="DELETED">Deleted</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? 'Saving...' : mode === 'create' ? 'Create User' : 'Save User'}
        </button>
      </div>
    </form>
  );
}
