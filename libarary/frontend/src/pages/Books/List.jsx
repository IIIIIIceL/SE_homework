import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import Pagination from '../../components/Pagination';
import styles from './Books.module.css';

const STATUS_MAP = {
  AVAILABLE: '可借阅',
  OFF_SHELF: '下架'
};

const STATUS_CLASS = {
  AVAILABLE: 'status-available',
  OFF_SHELF: 'status-offshelf'
};

export default function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await bookService.getBooks({
        keyword: keyword || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        pageSize
      });
      setBooks(result.data || []);
      setTotal(result.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || '获取书籍列表失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter, page, pageSize]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleDelete = async (bookId) => {
    if (!confirm('确定删除该图书吗？')) return;
    try {
      await bookService.deleteBook(bookId);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || '删除失败');
    }
  };

  const handleStatusChange = async (bookId, currentStatus) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'OFF_SHELF' : 'AVAILABLE';
    try {
      await bookService.updateBookStatus(bookId, newStatus);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || '状态修改失败');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>书籍管理</h2>
        <button className={styles.primaryBtn} onClick={() => navigate('/books/create')}>新增书籍</button>
      </div>

      <form className={styles.filterBar} onSubmit={handleSearch}>
        <input
          className={styles.input}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索标题/作者"
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="ALL">全部状态</option>
          <option value="AVAILABLE">可借阅</option>
          <option value="OFF_SHELF">已下架</option>
        </select>
        <button type="submit" className={styles.btn}>搜索</button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>加载中...</div>
      ) : books.length === 0 ? (
        <div className={styles.empty}>暂无数据</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>标题</th>
              <th>作者</th>
              <th>ISBN</th>
              <th>分类</th>
              <th>出版社</th>
              <th>总数</th>
              <th>可用</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.isbn}</td>
                <td>{b.categoryName || '-'}</td>
                <td>{b.publisherName || '-'}</td>
                <td>{b.totalCopies}</td>
                <td>{b.availableCopies}</td>
                <td>
                  <span className={styles[STATUS_CLASS[b.status] || '']}>
                    {STATUS_MAP[b.status] || b.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <Link to={`/books/${b.id}`}>详情</Link>
                  <button onClick={() => handleStatusChange(b.id, b.status)} className={styles.linkBtn}>
                    {b.status === 'AVAILABLE' ? '下架' : '上架'}
                  </button>
                  <button onClick={() => navigate(`/books/${b.id}/edit`)} className={styles.linkBtn}>编辑</button>
                  <button onClick={() => handleDelete(b.id)} className={`${styles.linkBtn} ${styles.danger}`}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  );
}
