import { useCallback, useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import { borrowService } from '../../services/borrowService';
import styles from '../Borrows/Borrows.module.css';

const STATUS_MAP = { BORROWED: '借阅中', RETURNED: '已归还', OVERDUE: '已超期', LOST: '已遗失' };
const STATUS_CLASS = { BORROWED: 'status-borrowed', RETURNED: 'status-returned', OVERDUE: 'status-overdue', LOST: 'status-lost' };

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
}

export default function MyBorrows() {
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [operatingId, setOperatingId] = useState(null);
  const [error, setError] = useState('');
  const pageSize = 10;

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await borrowService.getMyBorrows({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        pageSize
      });
      setRecords(result.data || []);
      setTotal(result.pagination?.total || 0);
    } catch (requestError) {
      setError(requestError.response?.data?.message || '获取借阅记录失败');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  async function handleRenew(record) {
    const currentDue = record.dueDate ? new Date(record.dueDate) : new Date();
    currentDue.setDate(currentDue.getDate() + 30);
    const dueDate = window.prompt('请输入新的到期日期（YYYY-MM-DD）：', currentDue.toISOString().slice(0, 10));
    if (!dueDate) return;
    setOperatingId(record.id);
    try {
      await borrowService.renewBook(record.id, { newDueDate: dueDate });
      window.alert('续借成功');
      fetchRecords();
    } catch (requestError) {
      window.alert(requestError.response?.data?.message || '续借失败');
    } finally {
      setOperatingId(null);
    }
  }

  async function handleReturn(record) {
    if (!window.confirm(`确认归还《${record.book?.title || '这本书'}》吗？`)) return;
    setOperatingId(record.id);
    try {
      await borrowService.returnMyBook(record.id);
      window.alert('归还成功');
      fetchRecords();
    } catch (requestError) {
      window.alert(requestError.response?.data?.message || '归还失败');
    } finally {
      setOperatingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2>我的借阅</h2></div>
      <form className={styles.filterBar} onSubmit={(event) => event.preventDefault()}>
        <select className={styles.select} value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">未归还</option>
          <option value="RETURNED">已归还</option>
          <option value="OVERDUE">已超期</option>
        </select>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      {(() => {
        if (loading) return <div className={styles.loading}>正在加载...</div>;
        if (records.length === 0) return <div className={styles.empty}>暂无借阅数据</div>;
        return (
        <table className={styles.table}>
          <thead><tr><th>借阅编号</th><th>图书</th><th>借阅日期</th><th>应还日期</th><th>归还日期</th><th>续借次数</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>{records.map((record) => {
            const canOperate = record.status === 'BORROWED' || record.status === 'OVERDUE';
            const disabled = operatingId === record.id;
            return (
              <tr key={record.id} className={record.status === 'OVERDUE' ? styles.rowOverdue : ''}>
                <td>{record.borrowNo}</td>
                <td>{record.book?.title || '-'}</td>
                <td>{formatDate(record.borrowDate)}</td>
                <td>{formatDate(record.dueDate)}</td>
                <td>{formatDate(record.returnDate)}</td>
                <td>{record.renewCount || 0}</td>
                <td><span className={styles[STATUS_CLASS[record.status] || '']}>{STATUS_MAP[record.status] || record.status}</span></td>
                <td className={styles.actions}>
                  {canOperate ? (
                    <>
                      <button className={styles.linkBtn} onClick={() => handleRenew(record)} disabled={disabled}>续借</button>
                      <button className={styles.linkBtn} onClick={() => handleReturn(record)} disabled={disabled}>归还</button>
                    </>
                  ) : '-'}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        );
      })()}
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  );
}
