import { useEffect, useState } from 'react';
import Pagination from '../../../components/Pagination';
import { systemService } from '../../../services/systemService';
import styles from '../System.module.css';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 10;

  useEffect(() => {
    loadLogs();
  }, [page, appliedKeyword, action]);

  async function loadLogs() {
    setLoading(true);
    setError('');
    try {
      const result = await systemService.getLogs({
        page,
        pageSize,
        keyword: appliedKeyword || undefined,
        action: action || undefined
      });
      setLogs(result.data);
      setTotal(result.pagination.total);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load logs.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Operation Logs</h2>
          <p className={styles.subtle}>Review recent actions, targets and operators.</p>
        </div>
      </div>

      <section className={styles.panel}>
        <form
          className={styles.filterBar}
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setAppliedKeyword(keyword);
          }}
        >
          <input
            className={styles.input}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search by action detail or target type"
          />
          <input
            className={styles.input}
            value={action}
            onChange={(event) => {
              setAction(event.target.value);
              setPage(1);
            }}
            placeholder="Action filter"
          />
          <button type="submit" className={styles.btn}>Search</button>
        </form>

        {error ? <div className={styles.error}>{error}</div> : null}

        {loading ? (
          <div className={styles.loading}>Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className={styles.empty}>No logs found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Operator</th>
                <th>Action</th>
                <th>Target</th>
                <th>Detail</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.user?.fullName || log.user?.username || '-'}</td>
                  <td>{log.action}</td>
                  <td>{log.targetType || '-'} {log.targetId ? `#${log.targetId}` : ''}</td>
                  <td>{log.detail || '-'}</td>
                  <td>{log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </section>
    </div>
  );
}
