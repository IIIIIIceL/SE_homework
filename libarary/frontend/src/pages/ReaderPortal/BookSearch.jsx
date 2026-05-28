import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import { bookService } from '../../services/bookService';
import { borrowService } from '../../services/borrowService';
import styles from '../Books/Books.module.css';

const STATUS_MAP = { AVAILABLE: '可借阅', OFF_SHELF: '已下架' };
const STATUS_CLASS = { AVAILABLE: 'status-available', OFF_SHELF: 'status-offshelf' };

export default function ReaderBookSearch() {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('AVAILABLE');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [error, setError] = useState('');
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
    } catch (requestError) {
      setError(requestError.response?.data?.message || '获取图书列表失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, page, pageSize, statusFilter]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    fetchBooks();
  }

  async function handleBorrow(book) {
    if (!window.confirm(`确认借阅《${book.title}》吗？默认借期为 30 天。`)) return;
    setBorrowingId(book.id);
    try {
      await borrowService.borrowMyBook(book.id);
      window.alert('借阅成功，请在“我的借阅”中查看应还日期。');
      fetchBooks();
    } catch (requestError) {
      window.alert(requestError.response?.data?.message || '借阅失败');
    } finally {
      setBorrowingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2>图书检索</h2></div>
      <form className={styles.filterBar} onSubmit={handleSearch}>
        <input className={styles.input} value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索书名 / 作者 / ISBN" />
        <select className={styles.select} value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
          <option value="AVAILABLE">可借阅</option>
          <option value="ALL">全部状态</option>
        </select>
        <button type="submit" className={styles.btn}>搜索</button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      {loading ? <div className={styles.loading}>正在加载...</div> : books.length === 0 ? <div className={styles.empty}>暂无图书数据</div> : (
        <table className={styles.table}>
          <thead><tr><th>书名</th><th>作者</th><th>ISBN</th><th>分类</th><th>出版社</th><th>可用册数</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>{books.map((book) => {
            const canBorrow = book.status === 'AVAILABLE' && Number(book.availableCopies) > 0;
            return (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.categoryName || '-'}</td>
                <td>{book.publisherName || '-'}</td>
                <td>{book.availableCopies}</td>
                <td><span className={styles[STATUS_CLASS[book.status] || '']}>{STATUS_MAP[book.status] || book.status}</span></td>
                <td className={styles.actions}>
                  <Link to={`/reader/books/${book.id}`}>详情</Link>
                  {canBorrow ? <button className={styles.linkBtn} onClick={() => handleBorrow(book)} disabled={borrowingId === book.id}>{borrowingId === book.id ? '借阅中...' : '借阅'}</button> : null}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      )}
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  );
}
