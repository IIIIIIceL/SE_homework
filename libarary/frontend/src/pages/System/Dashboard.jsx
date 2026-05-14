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
        const [statsData, logStatsData] = await Promise.all([
          systemService.getStats(),
          systemService.getLogStats(7)
        ]);
        setStats(statsData);
        setLogStats(logStatsData);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load system dashboard.');
      }
    }

    loadData();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>System Overview</h2>
          <p className={styles.subtle}>Track users, roles and recent audit activity from one place.</p>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <section className={styles.gridCards}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Active Users</p>
          <p className={styles.cardValue}>{stats?.activeUsers ?? '-'}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Disabled Users</p>
          <p className={styles.cardValue}>{stats?.disabledUsers ?? '-'}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Deleted Users</p>
          <p className={styles.cardValue}>{stats?.deletedUsers ?? '-'}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Roles</p>
          <p className={styles.cardValue}>{stats?.totalRoles ?? '-'}</p>
        </div>
      </section>

      <section className={styles.split}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
          </div>
          <div className={styles.actions}>
            <Link className={styles.primaryBtn} to={ROUTES.systemRoles}>Manage Roles</Link>
            <Link className={styles.btn} to={ROUTES.systemUsers}>Manage Users</Link>
            <Link className={styles.btn} to={ROUTES.systemLogs}>View Logs</Link>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.sectionTitle}>Recent Log Summary</h3>
          </div>
          {logStats?.byAction?.length ? (
            <div className={styles.trendList}>
              {logStats.byAction.map((item) => (
                <div key={item.action} className={styles.trendItem}>
                  <strong>{item.action}</strong>
                  <p className={styles.subtle}>{item.count} actions in the last 7 days</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>No operation logs available for the selected window.</div>
          )}
        </div>
      </section>
    </div>
  );
}
