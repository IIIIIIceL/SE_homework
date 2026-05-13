import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import styles from './Books.module.css';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBook = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookService.getBookDetail(id);
      setBook(data);
    } catch (err) {
      setError(err.response?.data?.message || '获取书籍详情失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchBook(); }, [fetchBook]);

  const handleDelete = async () => {
    if (!confirm('确定删除该图书吗？')) return;
    try {
      await bookService.deleteBook(id);
      navigate('/books');
    } catch (err) {
      alert(err.response?.data?.message || '删除失败');
    }
  };

  if (loading) return <div className={styles.loading}>加载中...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!book) return <div className={styles.empty}>书籍不存在</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>书籍详情</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.btn} onClick={() => navigate(`/books/${id}/edit`)}>编辑</button>
          <button className={`${styles.btn} ${styles.danger}`} onClick={handleDelete}>删除</button>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 24, borderRadius: 4 }}>
        <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 24px', fontSize: 14 }}>
          <dt style={{ color: '#666' }}>ID</dt><dd>{book.id}</dd>
          <dt style={{ color: '#666' }}>ISBN</dt><dd>{book.isbn}</dd>
          <dt style={{ color: '#666' }}>标题</dt><dd>{book.title}</dd>
          <dt style={{ color: '#666' }}>作者</dt><dd>{book.author}</dd>
          <dt style={{ color: '#666' }}>译者</dt><dd>{book.translator || '-'}</dd>
          <dt style={{ color: '#666' }}>分类</dt><dd>{book.categoryName || '-'}</dd>
          <dt style={{ color: '#666' }}>出版社</dt><dd>{book.publisherName || '-'}</dd>
          <dt style={{ color: '#666' }}>出版日期</dt><dd>{book.publishDate ? new Date(book.publishDate).toLocaleDateString() : '-'}</dd>
          <dt style={{ color: '#666' }}>价格</dt><dd>{book.price ? `¥${book.price}` : '-'}</dd>
          <dt style={{ color: '#666' }}>总册数</dt><dd>{book.totalCopies}</dd>
          <dt style={{ color: '#666' }}>可用册数</dt><dd>{book.availableCopies}</dd>
          <dt style={{ color: '#666' }}>存放位置</dt><dd>{book.location || '-'}</dd>
          <dt style={{ color: '#666' }}>关键字</dt><dd>{book.keywords || '-'}</dd>
          <dt style={{ color: '#666' }}>摘要</dt><dd>{book.summary || '-'}</dd>
          <dt style={{ color: '#666' }}>状态</dt><dd>{book.status}</dd>
        </dl>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/books" style={{ color: '#1890ff' }}>← 返回列表</Link>
      </div>
    </div>
  );
}
