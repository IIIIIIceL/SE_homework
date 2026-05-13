import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { borrowService } from '../../services/borrowService';
import Pagination from '../../components/Pagination';
import styles from './Borrows.module.css';

export default function Overdue() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchOverdue = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await borrowService.getOverdueRecords({ page, pageSize });
      setRecords(result.data || []);
      setTotal(result.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || '获取超期记录失败');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { fetchOverdue(); }, [fetchOverdue]);

  const handleReturn = async (borrowId) => {
    if (!confirm('确认归还此书？')) return;
    try {
      await borrowService.returnBook(borrowId);
      fetchOverdue();
    } catch (err) {
      alert(err.response?.data?.message || '归还失败');
    }
  };

  const calcOverdueDays = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    return Math.max(0, Math.ceil((now - due) / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>超期记录</h2>
        <button className={styles.btn} onClick={() => navigate('/borrows')}>返回列表</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>加载中...</div>
      ) : records.length === 0 ? (
        <div className={styles.empty}>暂无超期记录</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>借阅号</th>
              <th>读者</th>
              <th>书籍</th>
              <th>借阅日期</th>
              <th>应还日期</th>
              <th>逾期天数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const overdueDays = calcOverdueDays(r.dueDate);
              return (
                <tr key={r.id} className={styles.rowOverdue}>
                  <td>{r.borrowNo}</td>
                  <td>{r.reader?.name || '-'}</td>
                  <td>{r.book?.title || '-'}</td>
                  <td>{r.borrowDate ? new Date(r.borrowDate).toLocaleDateString() : '-'}</td>
                  <td>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-'}</td>
                  <td style={{ color: '#ff4d4f', fontWeight: 600 }}>{overdueDays} 天</td>
                  <td className={styles.actions}>
                    <button onClick={() => navigate(`/borrows/${r.id}`)} className={styles.linkBtn}>详情</button>
                    <button onClick={() => handleReturn(r.id)} className={styles.linkBtn}>快速还书</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  );
}
