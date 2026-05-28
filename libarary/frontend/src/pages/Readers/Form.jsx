import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { readerService } from '../../services/readerService';
import styles from './ReadersForm.module.css';

const defaultForm = { readerNo: '', name: '', gender: 'UNKNOWN', phone: '', email: '', department: '', className: '', maxBorrowCount: 5, status: 'ACTIVE', remark: '' };

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
        setForm({ readerNo: data.readerNo || '', name: data.name || '', gender: data.gender || 'UNKNOWN', phone: data.phone || '', email: data.email || '', department: data.department || '', className: data.className || '', maxBorrowCount: data.maxBorrowCount || 5, status: data.status || 'ACTIVE', remark: data.remark || '' });
      } catch (error) {
        setErrors({ _form: error.response?.data?.error || '获取读者详情失败' });
      } finally {
        setLoading(false);
      }
    }
    loadReader();
  }, [id, mode]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = '读者姓名不能为空';
    if (form.phone && !/^1\d{10}$/.test(form.phone.trim())) nextErrors.phone = '手机号必须为 11 位';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = '邮箱格式不正确';
    if (!String(form.maxBorrowCount).trim() || Number(form.maxBorrowCount) < 1) nextErrors.maxBorrowCount = '最大借阅数至少为 1';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = { name: form.name.trim(), gender: form.gender, phone: form.phone.trim() || undefined, email: form.email.trim() || undefined, department: form.department.trim() || undefined, className: form.className.trim() || undefined, maxBorrowCount: Number(form.maxBorrowCount), status: form.status, remark: form.remark.trim() || undefined };
    if (mode === 'create' && form.readerNo.trim()) payload.readerNo = form.readerNo.trim();
    try {
      if (mode === 'create') await readerService.createReader(payload);
      else await readerService.updateReader(id, payload);
      navigate(ROUTES.readers);
    } catch (error) {
      setErrors({ _form: error.response?.data?.error || error.response?.data?.message || '保存读者失败' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className={styles.loading}>正在加载读者...</div>;

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.header}><h2>{mode === 'create' ? '新增读者' : '编辑读者'}</h2><p>维护读者档案、借阅额度和联系方式。</p></div>
      {errors._form && <div className={styles.error}>{errors._form}</div>}
      <div className={styles.grid}>
        <Field label="读者编号"><input className={styles.input} value={form.readerNo} onChange={(event) => update('readerNo', event.target.value)} placeholder="不填写则由后端自动生成" disabled={mode === 'edit'} /></Field>
        <Field label="姓名" error={errors.name}><input className={styles.input} value={form.name} onChange={(event) => update('name', event.target.value)} /></Field>
        <Field label="性别"><select className={styles.select} value={form.gender} onChange={(event) => update('gender', event.target.value)}><option value="UNKNOWN">未知</option><option value="MALE">男</option><option value="FEMALE">女</option></select></Field>
        <Field label="状态"><select className={styles.select} value={form.status} onChange={(event) => update('status', event.target.value)}><option value="ACTIVE">正常</option><option value="INACTIVE">停用</option><option value="DELETED">已删除</option></select></Field>
        <Field label="手机号" error={errors.phone}><input className={styles.input} value={form.phone} onChange={(event) => update('phone', event.target.value)} /></Field>
        <Field label="邮箱" error={errors.email}><input className={styles.input} value={form.email} onChange={(event) => update('email', event.target.value)} /></Field>
        <Field label="院系"><input className={styles.input} value={form.department} onChange={(event) => update('department', event.target.value)} /></Field>
        <Field label="班级"><input className={styles.input} value={form.className} onChange={(event) => update('className', event.target.value)} /></Field>
        <Field label="最大借阅数" error={errors.maxBorrowCount}><input className={styles.input} type="number" min="1" value={form.maxBorrowCount} onChange={(event) => update('maxBorrowCount', event.target.value)} /></Field>
        <div className={styles.full}><Field label="备注"><textarea className={styles.textarea} value={form.remark} onChange={(event) => update('remark', event.target.value)} /></Field></div>
      </div>
      <div className={styles.footer}><button type="button" className={styles.btn} onClick={() => navigate(-1)}>取消</button><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? '保存中...' : mode === 'create' ? '创建读者' : '保存修改'}</button></div>
    </form>
  );
}

function Field({ label, error, children }) {
  return <div className={styles.field}><label>{label}</label>{children}{error ? <span className={styles.fieldError}>{error}</span> : null}</div>;
}
