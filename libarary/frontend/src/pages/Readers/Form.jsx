import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { readerService } from '../../services/readerService';
import styles from './ReadersForm.module.css';

const defaultForm = {
  readerNo: '',
  name: '',
  gender: 'UNKNOWN',
  phone: '',
  email: '',
  department: '',
  className: '',
  maxBorrowCount: 5,
  status: 'ACTIVE',
  remark: ''
};

export default function ReaderForm({ mode = 'create' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;

    async function loadReader() {
      try {
        const data = await readerService.getReaderDetail(id);
        setForm({
          readerNo: data.readerNo || '',
          name: data.name || '',
          gender: data.gender || 'UNKNOWN',
          phone: data.phone || '',
          email: data.email || '',
          department: data.department || '',
          className: data.className || '',
          maxBorrowCount: data.maxBorrowCount || 5,
          status: data.status || 'ACTIVE',
          remark: data.remark || ''
        });
      } catch (error) {
        setErrors({ _form: error.response?.data?.error || 'Failed to load reader details.' });
      } finally {
        setLoading(false);
      }
    }

    loadReader();
  }, [id, mode]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  }

  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Reader name is required.';
    if (form.phone && !/^1\d{10}$/.test(form.phone.trim())) nextErrors.phone = 'Phone number must be 11 digits.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = 'Email format is invalid.';
    if (!String(form.maxBorrowCount).trim() || Number(form.maxBorrowCount) < 1) {
      nextErrors.maxBorrowCount = 'Max borrow count must be at least 1.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      gender: form.gender,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      department: form.department.trim() || undefined,
      className: form.className.trim() || undefined,
      maxBorrowCount: Number(form.maxBorrowCount),
      status: form.status,
      remark: form.remark.trim() || undefined
    };

    if (mode === 'create' && form.readerNo.trim()) {
      payload.readerNo = form.readerNo.trim();
    }

    try {
      if (mode === 'create') {
        await readerService.createReader(payload);
      } else {
        await readerService.updateReader(id, payload);
      }

      navigate(ROUTES.readers);
    } catch (error) {
      setErrors({ _form: error.response?.data?.error || error.response?.data?.message || 'Failed to save reader.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading reader...</div>;
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2>{mode === 'create' ? 'Create Reader' : 'Edit Reader'}</h2>
        <p>Manage reader profile, borrowing limit and contact information.</p>
      </div>

      {errors._form && <div className={styles.error}>{errors._form}</div>}

      <div className={styles.grid}>
        <Field label="Reader No">
          <input
            className={styles.input}
            value={form.readerNo}
            onChange={(event) => update('readerNo', event.target.value)}
            placeholder="Optional if backend auto-generates"
            disabled={mode === 'edit'}
          />
        </Field>

        <Field label="Name" error={errors.name}>
          <input className={styles.input} value={form.name} onChange={(event) => update('name', event.target.value)} />
        </Field>

        <Field label="Gender">
          <select className={styles.select} value={form.gender} onChange={(event) => update('gender', event.target.value)}>
            <option value="UNKNOWN">Unknown</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </Field>

        <Field label="Status">
          <select className={styles.select} value={form.status} onChange={(event) => update('status', event.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DELETED">Deleted</option>
          </select>
        </Field>

        <Field label="Phone" error={errors.phone}>
          <input className={styles.input} value={form.phone} onChange={(event) => update('phone', event.target.value)} />
        </Field>

        <Field label="Email" error={errors.email}>
          <input className={styles.input} value={form.email} onChange={(event) => update('email', event.target.value)} />
        </Field>

        <Field label="Department">
          <input className={styles.input} value={form.department} onChange={(event) => update('department', event.target.value)} />
        </Field>

        <Field label="Class">
          <input className={styles.input} value={form.className} onChange={(event) => update('className', event.target.value)} />
        </Field>

        <Field label="Max Borrow Count" error={errors.maxBorrowCount}>
          <input
            className={styles.input}
            type="number"
            min="1"
            value={form.maxBorrowCount}
            onChange={(event) => update('maxBorrowCount', event.target.value)}
          />
        </Field>

        <div className={styles.full}>
          <Field label="Remark">
            <textarea className={styles.textarea} value={form.remark} onChange={(event) => update('remark', event.target.value)} />
          </Field>
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.btn} onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? 'Saving...' : mode === 'create' ? 'Create Reader' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {children}
      {error ? <span className={styles.fieldError}>{error}</span> : null}
    </div>
  );
}
