import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    try { const result = await borrowService.getOverdueRecords({ page, pageSize }); setRecords(result.data || []); setTotal(result.pagination?.total || 0); } catch (err) { setError(err.response?.data?.message || '获取超期记录失败'); } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchOverdue(); }, [fetchOverdue]);

  async function handleReturn(borrowId) { if (!window.confirm('确认归还这本书吗？')) return; try { await borrowService.returnBook(borrowId); fetchOverdue(); } catch (err) { window.alert(err.response?.data?.message || '归还失败'); } }
  function calcOverdueDays(dueDate) { const now = new Date(); const due = new Date(dueDate); return Math.max(0, Math.ceil((now - due) / (1000 * 60 * 60 * 24))); }

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2>超期记录</h2><button className={styles.btn} onClick={() => navigate('/borrows')}>返回借阅列表</button></div>
      {error && <div className={styles.error}>{error}</div>}
      {loading ? <div className={styles.loading}>正在加载...</div> : records.length === 0 ? <div className={styles.empty}>暂无超期记录</div> : (
        <table className={styles.table}>
          <thead><tr><th>借阅编号</th><th>读者</th><th>图书</th><th>借阅日期</th><th>应还日期</th><th>超期天数</th><th>操作</th></tr></thead>
          <tbody>{records.map((record) => { const overdueDays = calcOverdueDays(record.dueDate); return <tr key={record.id} className={styles.rowOverdue}><td>{record.borrowNo}</td><td>{record.reader?.name || '-'}</td><td>{record.book?.title || '-'}</td><td>{record.borrowDate ? new Date(record.borrowDate).toLocaleDateString() : '-'}</td><td>{record.dueDate ? new Date(record.dueDate).toLocaleDateString() : '-'}</td><td style={{ color: '#ff4d4f', fontWeight: 600 }}>{overdueDays} 天</td><td className={styles.actions}><button onClick={() => navigate(`/borrows/${record.id}`)} className={styles.linkBtn}>详情</button><button onClick={() => handleReturn(record.id)} className={styles.linkBtn}>快速还书</button></td></tr>; })}</tbody>
        </table>
      )}
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  );
}
