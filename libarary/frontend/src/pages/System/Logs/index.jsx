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

  useEffect(() => { loadLogs(); }, [page, appliedKeyword, action]);

  async function loadLogs() {
    setLoading(true);
    setError('');
    try {
      const result = await systemService.getLogs({ page, pageSize, keyword: appliedKeyword || undefined, action: action || undefined });
      setLogs(result.data);
      setTotal(result.pagination.total);
    } catch (requestError) {
      setError(requestError.response?.data?.message || '加载日志失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}><div><h2>操作日志</h2><p className={styles.subtle}>查看最近的操作、对象和操作人员。</p></div></div>
      <section className={styles.panel}>
        <form className={styles.filterBar} onSubmit={(event) => { event.preventDefault(); setPage(1); setAppliedKeyword(keyword); }}>
          <input className={styles.input} value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索操作详情或对象类型" />
          <input className={styles.input} value={action} onChange={(event) => { setAction(event.target.value); setPage(1); }} placeholder="按操作类型筛选" />
          <button type="submit" className={styles.btn}>搜索</button>
        </form>
        {error ? <div className={styles.error}>{error}</div> : null}
        {loading ? <div className={styles.loading}>正在加载日志...</div> : logs.length === 0 ? <div className={styles.empty}>暂无日志</div> : <table className={styles.table}><thead><tr><th>操作人</th><th>操作</th><th>对象</th><th>详情</th><th>时间</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id}><td>{log.user?.fullName || log.user?.username || '-'}</td><td>{log.action}</td><td>{log.targetType || '-'} {log.targetId ? `#${log.targetId}` : ''}</td><td>{log.detail || '-'}</td><td>{log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}</td></tr>)}</tbody></table>}
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </section>
    </div>
  );
}
