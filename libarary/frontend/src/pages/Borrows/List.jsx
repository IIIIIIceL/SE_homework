import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { borrowService } from '../../services/borrowService';
import Pagination from '../../components/Pagination';
import styles from './Borrows.module.css';

const STATUS_MAP = {
  BORROWED: '借阅中',
  RETURNED: '已归还',
  OVERDUE: '已超期',
  LOST: '已遗失'
};

const STATUS_CLASS = {
  BORROWED: 'status-borrowed',
  RETURNED: 'status-returned',
  OVERDUE: 'status-overdue',
  LOST: 'status-lost'
};

export default function BorrowList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await borrowService.getBorrows({
        keyword: keyword || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        pageSize
      });
      setRecords(result.data || []);
      setTotal(result.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || '获取借阅列表失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter, page, pageSize]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const handleReturn = async (borrowId) => {
    if (!confirm('确认归还此书？')) return;
    try {
      await borrowService.returnBook(borrowId);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || '归还失败');
    }
  };

  const handleRenew = async (borrowId) => {
    const dueDate = prompt('请输入新的到期日期（YYYY-MM-DD）：');
    if (!dueDate) return;
    try {
      await borrowService.renewBook(borrowId, { newDueDate: dueDate });
      alert('续借成功');
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || '续借失败');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>借阅管理</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.btn} onClick={() => navigate('/borrows/overdue')}>超期记录</button>
          <button className={styles.primaryBtn} onClick={() => navigate('/borrows/borrow')}>借书</button>
        </div>
      </div>

      <form className={styles.filterBar} onSubmit={handleSearch}>
        <input
          className={styles.input}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索读者名/书名"
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="ALL">全部状态</option>
          <option value="BORROWED">借阅中</option>
          <option value="RETURNED">已归还</option>
          <option value="OVERDUE">已超期</option>
          <option value="LOST">已遗失</option>
        </select>
        <button type="submit" className={styles.btn}>搜索</button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>加载中...</div>
      ) : records.length === 0 ? (
        <div className={styles.empty}>暂无数据</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>借阅号</th>
              <th>读者</th>
              <th>书籍</th>
              <th>借阅日期</th>
              <th>应还日期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className={r.status === 'OVERDUE' ? styles.rowOverdue : ''}>
                <td>{r.borrowNo}</td>
                <td>{r.reader?.name || '-'}</td>
                <td>{r.book?.title || '-'}</td>
                <td>{r.borrowDate ? new Date(r.borrowDate).toLocaleDateString() : '-'}</td>
                <td>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-'}</td>
                <td>
                  <span className={styles[STATUS_CLASS[r.status] || '']}>
                    {STATUS_MAP[r.status] || r.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button onClick={() => navigate(`/borrows/${r.id}`)} className={styles.linkBtn}>详情</button>
                  {(r.status === 'BORROWED' || r.status === 'OVERDUE') && (
                    <>
                      <button onClick={() => handleReturn(r.id)} className={styles.linkBtn}>归还</button>
                      <button onClick={() => handleRenew(r.id)} className={styles.linkBtn}>续借</button>
                    </>
                  )}
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
