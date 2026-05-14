import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import { ROUTES } from '../../constants/routes';
import { readerService } from '../../services/readerService';
import styles from './Readers.module.css';

const STATUS_LABELS = { ACTIVE: '正常', INACTIVE: '停用', DELETED: '已删除', UNKNOWN: '未知' };
const GENDER_LABELS = { UNKNOWN: '未知', MALE: '男', FEMALE: '女' };
const STATUS_CLASS_NAMES = { ACTIVE: 'statusActive', INACTIVE: 'statusInactive', DELETED: 'statusDeleted' };

export default function ReaderList() {
  const navigate = useNavigate();
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => { loadReaders(); }, [page, status, appliedKeyword]);

  async function loadReaders() {
    setLoading(true);
    setError('');
    try {
      const result = await readerService.getReaders({ page, pageSize, keyword: appliedKeyword, status });
      setReaders(result.data);
      setTotal(result.total);
    } catch (requestError) {
      setError(requestError.response?.data?.error || '获取读者列表失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(readerId) {
    if (!window.confirm('确定删除该读者记录吗？')) return;
    try {
      await readerService.deleteReader(readerId);
      await loadReaders();
    } catch (requestError) {
      setError(requestError.response?.data?.error || '删除读者失败');
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setAppliedKeyword(keyword);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>读者管理</h2>
          <p>维护读者档案、借阅额度和联系方式。</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => navigate(ROUTES.createReader)}>新增读者</button>
      </div>

      <form className={styles.filterBar} onSubmit={handleSearch}>
        <input className={styles.input} value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索姓名、读者编号、手机号或班级" />
        <select className={styles.select} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">正常</option>
          <option value="INACTIVE">停用</option>
          <option value="DELETED">已删除</option>
        </select>
        <button type="submit" className={styles.btn}>搜索</button>
      </form>

      {error ? <div className={styles.error}>{error}</div> : null}

      {loading ? <div className={styles.loading}>正在加载读者...</div> : readers.length === 0 ? <div className={styles.empty}>暂无读者记录</div> : (
        <table className={styles.table}>
          <thead><tr><th>读者编号</th><th>姓名</th><th>性别</th><th>手机号</th><th>院系</th><th>班级</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {readers.map((reader) => (
              <tr key={reader.id}>
                <td>{reader.readerNo || '-'}</td><td>{reader.name || '-'}</td><td>{GENDER_LABELS[reader.gender] || reader.gender || '-'}</td><td>{reader.phone || '-'}</td><td>{reader.department || '-'}</td><td>{reader.className || '-'}</td>
                <td><span className={styles[STATUS_CLASS_NAMES[reader.status] || 'statusInactive']}>{STATUS_LABELS[reader.status] || reader.status || '未知'}</span></td>
                <td className={styles.actions}><Link to={`/readers/${reader.id}`}>详情</Link><button className={styles.linkBtn} onClick={() => navigate(`/readers/${reader.id}/edit`)}>编辑</button><button className={`${styles.linkBtn} ${styles.danger}`} onClick={() => handleDelete(reader.id)}>删除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  );
}
