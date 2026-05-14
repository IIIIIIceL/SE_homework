import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import { ROUTES } from '../../constants/routes';
import { readerService } from '../../services/readerService';
import styles from './Readers.module.css';

const STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted'
};

const STATUS_CLASS_NAMES = {
  ACTIVE: 'statusActive',
  INACTIVE: 'statusInactive',
  DELETED: 'statusDeleted'
};

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

  useEffect(() => {
    loadReaders();
  }, [page, status, appliedKeyword]);

  async function loadReaders() {
    setLoading(true);
    setError('');

    try {
      const result = await readerService.getReaders({
        page,
        pageSize,
        keyword: appliedKeyword,
        status
      });
      setReaders(result.data);
      setTotal(result.total);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to load readers.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(readerId) {
    if (!window.confirm('Delete this reader record?')) return;

    try {
      await readerService.deleteReader(readerId);
      await loadReaders();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to delete reader.');
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
          <h2>Reader Management</h2>
          <p>Manage reader records, borrowing limits and contact information.</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => navigate(ROUTES.createReader)}>
          Create Reader
        </button>
      </div>

      <form className={styles.filterBar} onSubmit={handleSearch}>
        <input
          className={styles.input}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search by name, reader no, phone or class"
        />
        <select
          className={styles.select}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DELETED">Deleted</option>
        </select>
        <button type="submit" className={styles.btn}>Search</button>
      </form>

      {error ? <div className={styles.error}>{error}</div> : null}

      {loading ? (
        <div className={styles.loading}>Loading readers...</div>
      ) : readers.length === 0 ? (
        <div className={styles.empty}>No reader records found.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reader No</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {readers.map((reader) => (
              <tr key={reader.id}>
                <td>{reader.readerNo || '-'}</td>
                <td>{reader.name || '-'}</td>
                <td>{reader.gender || '-'}</td>
                <td>{reader.phone || '-'}</td>
                <td>{reader.department || '-'}</td>
                <td>{reader.className || '-'}</td>
                <td>
                  <span className={styles[STATUS_CLASS_NAMES[reader.status] || 'statusInactive']}>
                    {STATUS_LABELS[reader.status] || reader.status || 'Unknown'}
                  </span>
                </td>
                <td className={styles.actions}>
                  <Link to={`/readers/${reader.id}`}>Detail</Link>
                  <button className={styles.linkBtn} onClick={() => navigate(`/readers/${reader.id}/edit`)}>
                    Edit
                  </button>
                  <button className={`${styles.linkBtn} ${styles.danger}`} onClick={() => handleDelete(reader.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  );
}
