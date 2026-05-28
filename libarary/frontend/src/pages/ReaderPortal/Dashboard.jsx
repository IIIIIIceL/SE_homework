import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { borrowService } from '../../services/borrowService';
import { readerService } from '../../services/readerService';
import styles from '../Borrows/Borrows.module.css';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
}

function calcOverdueDays(value) {
  if (!value) return 0;
  const dueDate = new Date(value);
  const today = new Date();
  if (Number.isNaN(dueDate.getTime()) || today <= dueDate) return 0;
  return Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
}

export default function ReaderDashboard() {
  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const [profileData, borrowData] = await Promise.all([
          readerService.getMyProfile(),
          borrowService.getMyBorrows({ status: 'ACTIVE', page: 1, pageSize: 5 })
        ]);
        setProfile(profileData);
        setRecords(borrowData.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.response?.data?.error || '获取读者首页失败');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const overdueRecords = records.filter((record) => calcOverdueDays(record.dueDate) > 0);

  if (loading) return <div className={styles.loading}>正在加载...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>我的首页</h2>
          <p style={{ margin: '6px 0 0', color: '#666' }}>{profile?.name || '读者'}，这里是你的个人借阅概览。</p>
        </div>
        <Link className={styles.btn} to="/reader/books">去找书</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
        <section className={styles.detailCard}><strong>当前借阅</strong><p style={{ fontSize: 28, margin: '12px 0 0' }}>{records.length}</p></section>
        <section className={styles.detailCard}><strong>最大可借</strong><p style={{ fontSize: 28, margin: '12px 0 0' }}>{profile?.maxBorrowCount ?? '-'}</p></section>
        <section className={styles.detailCard}><strong>超期提醒</strong><p style={{ fontSize: 28, margin: '12px 0 0', color: overdueRecords.length ? '#fa8c16' : '#52c41a' }}>{overdueRecords.length}</p></section>
      </div>

      <section className={styles.detailCard}>
        <h3 style={{ marginTop: 0 }}>近期借阅</h3>
        {records.length === 0 ? <div className={styles.empty}>当前没有未归还图书</div> : (
          <table className={styles.table}>
            <thead><tr><th>图书</th><th>应还日期</th><th>状态</th></tr></thead>
            <tbody>{records.map((record) => <tr key={record.id} className={calcOverdueDays(record.dueDate) > 0 ? styles.rowOverdue : ''}><td>{record.book?.title || '-'}</td><td>{formatDate(record.dueDate)}</td><td>{calcOverdueDays(record.dueDate) > 0 ? `已超期 ${calcOverdueDays(record.dueDate)} 天` : '借阅中'}</td></tr>)}</tbody>
          </table>
        )}
      </section>
    </div>
  );
}
