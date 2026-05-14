import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { systemService } from '../../services/systemService';
import styles from './System.module.css';

export default function SystemDashboard() {
  const [stats, setStats] = useState(null);
  const [logStats, setLogStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, logStatsData] = await Promise.all([systemService.getStats(), systemService.getLogStats(7)]);
        setStats(statsData);
        setLogStats(logStatsData);
      } catch (requestError) {
        setError(requestError.response?.data?.message || '加载系统概览失败');
      }
    }
    loadData();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}><div><h2>系统概览</h2><p className={styles.subtle}>集中查看用户、角色和近期操作日志。</p></div></div>
      {error ? <div className={styles.error}>{error}</div> : null}
      <section className={styles.gridCards}>
        <div className={styles.card}><p className={styles.cardLabel}>正常用户</p><p className={styles.cardValue}>{stats?.activeUsers ?? '-'}</p></div>
        <div className={styles.card}><p className={styles.cardLabel}>停用用户</p><p className={styles.cardValue}>{stats?.disabledUsers ?? '-'}</p></div>
        <div className={styles.card}><p className={styles.cardLabel}>已删除用户</p><p className={styles.cardValue}>{stats?.deletedUsers ?? '-'}</p></div>
        <div className={styles.card}><p className={styles.cardLabel}>角色数量</p><p className={styles.cardValue}>{stats?.totalRoles ?? '-'}</p></div>
      </section>
      <section className={styles.split}>
        <div className={styles.panel}><div className={styles.panelHeader}><h3 className={styles.sectionTitle}>快捷操作</h3></div><div className={styles.actions}><Link className={styles.primaryBtn} to={ROUTES.systemRoles}>管理角色</Link><Link className={styles.btn} to={ROUTES.systemUsers}>管理用户</Link><Link className={styles.btn} to={ROUTES.systemLogs}>查看日志</Link></div></div>
        <div className={styles.panel}><div className={styles.panelHeader}><h3 className={styles.sectionTitle}>最近日志汇总</h3></div>{logStats?.byAction?.length ? <div className={styles.trendList}>{logStats.byAction.map((item) => <div key={item.action} className={styles.trendItem}><strong>{item.action}</strong><p className={styles.subtle}>最近 7 天共 {item.count} 次操作</p></div>)}</div> : <div className={styles.empty}>当前时间范围内暂无操作日志。</div>}</div>
      </section>
    </div>
  );
}
