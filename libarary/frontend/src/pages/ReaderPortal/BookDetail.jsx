import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { borrowService } from '../../services/borrowService';
import styles from '../Books/Books.module.css';

const STATUS_MAP = { AVAILABLE: '可借阅', OFF_SHELF: '已下架' };

export default function ReaderBookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [error, setError] = useState('');

  async function loadBook() {
    setLoading(true);
    setError('');
    try {
      setBook(await bookService.getBookDetail(id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || '获取图书详情失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBook(); }, [id]);

  async function handleBorrow() {
    if (!window.confirm(`确认借阅《${book.title}》吗？默认借期为 30 天。`)) return;
    setBorrowing(true);
    try {
      await borrowService.borrowMyBook(book.id);
      window.alert('借阅成功，请在“我的借阅”中查看应还日期。');
      await loadBook();
    } catch (requestError) {
      window.alert(requestError.response?.data?.message || '借阅失败');
    } finally {
      setBorrowing(false);
    }
  }

  if (loading) return <div className={styles.loading}>正在加载...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!book) return <div className={styles.empty}>图书不存在</div>;

  const canBorrow = book.status === 'AVAILABLE' && Number(book.availableCopies) > 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>图书详情</h2>
        {canBorrow ? <button className={styles.primaryBtn} onClick={handleBorrow} disabled={borrowing}>{borrowing ? '借阅中...' : '借阅此书'}</button> : null}
      </div>
      <div style={{ background: '#fff', padding: 24, borderRadius: 4 }}>
        <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 24px', fontSize: 14 }}>
          <dt style={{ color: '#666' }}>ISBN</dt><dd>{book.isbn}</dd>
          <dt style={{ color: '#666' }}>书名</dt><dd>{book.title}</dd>
          <dt style={{ color: '#666' }}>作者</dt><dd>{book.author}</dd>
          <dt style={{ color: '#666' }}>译者</dt><dd>{book.translator || '-'}</dd>
          <dt style={{ color: '#666' }}>分类</dt><dd>{book.categoryName || '-'}</dd>
          <dt style={{ color: '#666' }}>出版社</dt><dd>{book.publisherName || '-'}</dd>
          <dt style={{ color: '#666' }}>出版日期</dt><dd>{book.publishDate ? new Date(book.publishDate).toLocaleDateString() : '-'}</dd>
          <dt style={{ color: '#666' }}>馆藏位置</dt><dd>{book.location || '-'}</dd>
          <dt style={{ color: '#666' }}>可用册数</dt><dd>{book.availableCopies}</dd>
          <dt style={{ color: '#666' }}>状态</dt><dd>{STATUS_MAP[book.status] || book.status}</dd>
          <dt style={{ color: '#666' }}>摘要</dt><dd>{book.summary || '-'}</dd>
        </dl>
      </div>
      <div style={{ marginTop: 16 }}><Link to="/reader/books" style={{ color: '#1890ff' }}>返回检索</Link></div>
    </div>
  );
}
