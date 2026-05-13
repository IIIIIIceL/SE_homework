import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { borrowService } from '../../services/borrowService';
import { bookService } from '../../services/bookService';
import styles from './Borrows.module.css';

export default function BorrowBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ readerId: '', bookId: '', dueDate: '', remark: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    // Load readers and available books for dropdown
    const loadData = async () => {
      try {
        const [readersRes, booksRes] = await Promise.all([
          // Reader list (backend path)
          fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/readers`).then(r => r.json()).catch(() => ({ data: [] })),
          bookService.getBooks({ page: 1, pageSize: 100 }).catch(() => ({ data: [] }))
        ]);
        setReaders(readersRes.data || []);
        setBooks(booksRes.data || []);
      } catch {
        setReaders([]);
        setBooks([]);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadData();
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.readerId) e.readerId = '请选择读者';
    if (!form.bookId) e.bookId = '请选择书籍';
    if (!form.dueDate) e.dueDate = '请选择应还日期';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await borrowService.borrowBook({
        readerId: Number(form.readerId),
        bookId: Number(form.bookId),
        dueDate: new Date(form.dueDate).toISOString(),
        remark: form.remark
      });
      alert('借书成功');
      navigate('/borrows');
    } catch (err) {
      setErrors({ _form: err.response?.data?.message || '借书失败' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2>借书</h2>

      <div className={styles.formSection}>
        {errors._form && <div className={styles.error}>{errors._form}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.detailGrid}>
            <label>读者</label>
            <div>
              {loadingOptions ? (
                <span>加载中...</span>
              ) : (
                <select
                  className={styles.select}
                  value={form.readerId}
                  onChange={(e) => update('readerId', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">请选择读者</option>
                  {readers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}（{r.readerNo}）</option>
                  ))}
                </select>
              )}
              {errors.readerId && <span className={styles.fieldError}>{errors.readerId}</span>}
            </div>

            <label>书籍</label>
            <div>
              {loadingOptions ? (
                <span>加载中...</span>
              ) : (
                <select
                  className={styles.select}
                  value={form.bookId}
                  onChange={(e) => update('bookId', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">请选择书籍</option>
                  {books.filter(b => b.availableCopies > 0).map((b) => (
                    <option key={b.id} value={b.id}>{b.title} - {b.author}（可借 {b.availableCopies} 册）</option>
                  ))}
                </select>
              )}
              {errors.bookId && <span className={styles.fieldError}>{errors.bookId}</span>}
            </div>

            <label>应还日期</label>
            <div>
              <input
                type="date"
                className={styles.input}
                value={form.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
              />
              {errors.dueDate && <span className={styles.fieldError}>{errors.dueDate}</span>}
            </div>

            <label>备注</label>
            <div>
              <textarea
                className={styles.textarea}
                value={form.remark}
                onChange={(e) => update('remark', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="submit" className={styles.primaryBtn} disabled={submitting}>
              {submitting ? '提交中...' : '确认借阅'}
            </button>
            <button type="button" className={styles.btn} onClick={() => navigate(-1)}>取消</button>
          </div>
        </form>
      </div>
    </div>
  );
}
