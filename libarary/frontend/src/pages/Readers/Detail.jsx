import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { readerService } from '../../services/readerService';
import styles from './Readers.module.css';

const STATUS_LABELS = { ACTIVE: '正常', INACTIVE: '停用', DELETED: '已删除' };
const GENDER_LABELS = { UNKNOWN: '未知', MALE: '男', FEMALE: '女' };
const BORROW_STATUS_LABELS = { BORROWED: '借阅中', RETURNED: '已归还', OVERDUE: '已超期', LOST: '已遗失' };

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

function normalizeHistoryRow(item) {
  return { id: item.id, bookTitle: item.book?.title || item.bookTitle || item.title || '-', borrowDate: item.borrowDate || item.createdAt, dueDate: item.dueDate, returnDate: item.returnDate, status: item.status || '-' };
}

export default function ReaderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reader, setReader] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const [readerData, historyData] = await Promise.all([readerService.getReaderDetail(id), readerService.getReaderHistory(id)]);
        setReader(readerData);
        setHistory((historyData || []).map(normalizeHistoryRow));
      } catch (requestError) {
        setError(requestError.response?.data?.error || '获取读者详情失败');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('确定删除该读者记录吗？')) return;
    try {
      await readerService.deleteReader(id);
      navigate('/readers');
    } catch (requestError) {
      setError(requestError.response?.data?.error || '删除读者失败');
    }
  }

  if (loading) return <div className={styles.loading}>正在加载读者详情...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!reader) return <div className={styles.empty}>未找到读者记录</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div><h2>{reader.name}</h2><p>{reader.readerNo || '暂无读者编号'} · {reader.department || '暂无院系'}</p></div>
        <div className={styles.footer}><button className={styles.btn} onClick={() => navigate(`/readers/${id}/edit`)}>编辑读者</button><button className={`${styles.btn} ${styles.danger}`} onClick={handleDelete}>删除</button></div>
      </div>

      <section className={styles.panel}>
        <h3 className={styles.sectionTitle}>读者档案</h3>
        <dl className={styles.detailGrid}>
          <div className={styles.detailItem}><dt>读者编号</dt><dd>{reader.readerNo || '-'}</dd></div>
          <div className={styles.detailItem}><dt>状态</dt><dd>{STATUS_LABELS[reader.status] || reader.status || '-'}</dd></div>
          <div className={styles.detailItem}><dt>性别</dt><dd>{GENDER_LABELS[reader.gender] || reader.gender || '-'}</dd></div>
          <div className={styles.detailItem}><dt>手机号</dt><dd>{reader.phone || '-'}</dd></div>
          <div className={styles.detailItem}><dt>邮箱</dt><dd>{reader.email || '-'}</dd></div>
          <div className={styles.detailItem}><dt>院系</dt><dd>{reader.department || '-'}</dd></div>
          <div className={styles.detailItem}><dt>班级</dt><dd>{reader.className || '-'}</dd></div>
          <div className={styles.detailItem}><dt>最大借阅数</dt><dd>{reader.maxBorrowCount || '-'}</dd></div>
          <div className={styles.detailItem}><dt>创建时间</dt><dd>{formatDate(reader.createdAt)}</dd></div>
          <div className={styles.detailItem}><dt>更新时间</dt><dd>{formatDate(reader.updatedAt)}</dd></div>
          <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}><dt>备注</dt><dd>{reader.remark || '-'}</dd></div>
        </dl>
      </section>

      <section className={styles.panel}>
        <h3 className={styles.sectionTitle}>借阅历史</h3>
        {history.length === 0 ? <div className={styles.empty}>该读者暂无借阅记录</div> : (
          <table className={styles.table}>
            <thead><tr><th>图书</th><th>借阅日期</th><th>应还日期</th><th>归还日期</th><th>状态</th></tr></thead>
            <tbody>{history.map((item) => <tr key={item.id}><td>{item.bookTitle}</td><td>{formatDate(item.borrowDate)}</td><td>{formatDate(item.dueDate)}</td><td>{formatDate(item.returnDate)}</td><td>{BORROW_STATUS_LABELS[item.status] || item.status}</td></tr>)}</tbody>
          </table>
        )}
      </section>
    </div>
  );
}
