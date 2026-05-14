import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { borrowService } from '../../services/borrowService';
import styles from './Borrows.module.css';

const STATUS_MAP = { BORROWED: '借阅中', RETURNED: '已归还', OVERDUE: '已超期', LOST: '已遗失' };

export default function BorrowDetail() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecord = useCallback(async () => {
    setLoading(true);
    try { setRecord(await borrowService.getBorrowDetail(id)); } catch (err) { setError(err.response?.data?.message || '获取借阅详情失败'); } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchRecord(); }, [fetchRecord]);

  async function handleReturn() { if (!window.confirm('确认归还这本书吗？')) return; try { await borrowService.returnBook(id); fetchRecord(); } catch (err) { window.alert(err.response?.data?.message || '归还失败'); } }
  async function handleRenew() { const dueDate = window.prompt('请输入新的到期日期（YYYY-MM-DD）：'); if (!dueDate) return; try { await borrowService.renewBook(id, { newDueDate: dueDate }); window.alert('续借成功'); fetchRecord(); } catch (err) { window.alert(err.response?.data?.message || '续借失败'); } }

  if (loading) return <div className={styles.loading}>正在加载...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!record) return <div className={styles.empty}>借阅记录不存在</div>;

  const canOperate = record.status === 'BORROWED' || record.status === 'OVERDUE';

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2>借阅详情</h2><div style={{ display: 'flex', gap: 8 }}>{canOperate && <><button className={styles.btn} onClick={handleReturn}>归还</button><button className={styles.btn} onClick={handleRenew}>续借</button></>}</div></div>
      <div className={styles.detailCard}>
        <dl className={styles.detailGrid}>
          <dt>借阅编号</dt><dd>{record.borrowNo}</dd>
          <dt>读者</dt><dd>{record.reader?.name || '-'}（{record.reader?.readerNo || '-'}）</dd>
          <dt>图书</dt><dd>{record.book?.title || '-'}（{record.book?.author || '-'}）</dd>
          <dt>借阅日期</dt><dd>{record.borrowDate ? new Date(record.borrowDate).toLocaleDateString() : '-'}</dd>
          <dt>应还日期</dt><dd>{record.dueDate ? new Date(record.dueDate).toLocaleDateString() : '-'}</dd>
          <dt>归还日期</dt><dd>{record.returnDate ? new Date(record.returnDate).toLocaleDateString() : '-'}</dd>
          <dt>续借次数</dt><dd>{record.renewCount || 0}</dd>
          <dt>状态</dt><dd>{STATUS_MAP[record.status] || record.status}</dd>
          <dt>罚款</dt><dd>{record.fineAmount ? `¥${record.fineAmount}` : '无'}</dd>
          <dt>操作员</dt><dd>{record.borrowOperator?.fullName || '-'}</dd>
          <dt>备注</dt><dd>{record.remark || '-'}</dd>
        </dl>
        <h3 style={{ marginTop: 24 }}>时间线</h3>
        <div className={styles.timeline}>
          <div className={`${styles.timelineItem} ${styles.done}`}><div className={styles.label}>借出</div><div className={styles.time}>{record.borrowDate ? new Date(record.borrowDate).toLocaleString() : '-'}</div></div>
          {record.renewCount > 0 && <div className={styles.timelineItem}><div className={styles.label}>续借（{record.renewCount} 次）</div></div>}
          {record.returnDate ? <div className={`${styles.timelineItem} ${styles.done}`}><div className={styles.label}>归还</div><div className={styles.time}>{new Date(record.returnDate).toLocaleString()}</div></div> : <div className={styles.timelineItem}><div className={styles.label}>待归还</div><div className={styles.time}>应还：{record.dueDate ? new Date(record.dueDate).toLocaleDateString() : '-'}</div></div>}
        </div>
      </div>
      <div style={{ marginTop: 16 }}><Link to="/borrows" style={{ color: '#1890ff' }}>返回列表</Link></div>
    </div>
  );
}
