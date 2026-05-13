import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import styles from './BooksForm.module.css';

export default function BookForm({ mode = 'create', initialData }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    isbn: '',
    title: '',
    author: '',
    translator: '',
    categoryId: '',
    publisherId: '',
    publishDate: '',
    price: '',
    totalCopies: 1,
    location: '',
    keywords: '',
    summary: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && id && !initialData) {
      bookService.getBookDetail(id)
        .then((data) => {
          setForm({
            isbn: data.isbn || '',
            title: data.title || '',
            author: data.author || '',
            translator: data.translator || '',
            categoryId: data.categoryId || '',
            publisherId: data.publisherId || '',
            publishDate: data.publishDate ? new Date(data.publishDate).toISOString().split('T')[0] : '',
            price: data.price || '',
            totalCopies: data.totalCopies || 1,
            location: data.location || '',
            keywords: data.keywords || '',
            summary: data.summary || ''
          });
        })
        .catch(() => setErrors({ _form: '获取书籍信息失败' }))
        .finally(() => setLoading(false));
    }
  }, [mode, id, initialData]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setForm(initialData);
      setLoading(false);
    }
  }, [initialData, mode]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.isbn.trim()) e.isbn = 'ISBN不能为空';
    if (!form.title.trim()) e.title = '标题不能为空';
    if (!form.author.trim()) e.author = '作者不能为空';
    if (form.totalCopies < 1) e.totalCopies = '册数至少为1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (payload.categoryId) payload.categoryId = Number(payload.categoryId);
      if (payload.publisherId) payload.publisherId = Number(payload.publisherId);
      if (payload.price) payload.price = Number(payload.price);
      payload.totalCopies = Number(payload.totalCopies);

      if (mode === 'create') {
        await bookService.createBook(payload);
      } else {
        await bookService.updateBook(id, payload);
      }
      navigate(`/books`);
    } catch (err) {
      setErrors({ _form: err.response?.data?.message || '操作失败' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>加载中...</div>;

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <h2>{mode === 'create' ? '新增书籍' : '编辑书籍'}</h2>
      {errors._form && <div className={styles.error}>{errors._form}</div>}

      <div className={styles.grid}>
        <Field label="ISBN" error={errors.isbn}>
          <input className={styles.input} value={form.isbn} onChange={(e) => update('isbn', e.target.value)} />
        </Field>
        <Field label="标题" error={errors.title}>
          <input className={styles.input} value={form.title} onChange={(e) => update('title', e.target.value)} />
        </Field>
        <Field label="作者" error={errors.author}>
          <input className={styles.input} value={form.author} onChange={(e) => update('author', e.target.value)} />
        </Field>
        <Field label="译者">
          <input className={styles.input} value={form.translator} onChange={(e) => update('translator', e.target.value)} />
        </Field>
        <Field label="分类ID">
          <input className={styles.input} type="number" value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} />
        </Field>
        <Field label="出版社ID">
          <input className={styles.input} type="number" value={form.publisherId} onChange={(e) => update('publisherId', e.target.value)} />
        </Field>
        <Field label="出版日期">
          <input className={styles.input} type="date" value={form.publishDate} onChange={(e) => update('publishDate', e.target.value)} />
        </Field>
        <Field label="价格">
          <input className={styles.input} type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} />
        </Field>
        <Field label="总册数" error={errors.totalCopies}>
          <input className={styles.input} type="number" min="1" value={form.totalCopies} onChange={(e) => update('totalCopies', e.target.value)} />
        </Field>
        <Field label="存放位置">
          <input className={styles.input} value={form.location} onChange={(e) => update('location', e.target.value)} />
        </Field>
        <Field label="关键字">
          <input className={styles.input} value={form.keywords} onChange={(e) => update('keywords', e.target.value)} />
        </Field>
      </div>

      <div className={styles.full}>
        <Field label="摘要">
          <textarea className={styles.textarea} rows={3} value={form.summary} onChange={(e) => update('summary', e.target.value)} />
        </Field>
      </div>

      <div className={styles.footer}>
        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? '提交中...' : mode === 'create' ? '创建' : '保存'}
        </button>
        <button type="button" className={styles.btn} onClick={() => navigate(-1)}>取消</button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}
