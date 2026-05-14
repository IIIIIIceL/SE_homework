import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { readerService } from '../../services/readerService';
import styles from './Readers.module.css';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

function normalizeHistoryRow(item) {
  return {
    id: item.id,
    bookTitle: item.book?.title || item.bookTitle || item.title || '-',
    borrowDate: item.borrowDate || item.createdAt,
    dueDate: item.dueDate,
    returnDate: item.returnDate,
    status: item.status || '-'
  };
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
        const [readerData, historyData] = await Promise.all([
          readerService.getReaderDetail(id),
          readerService.getReaderHistory(id)
        ]);

        setReader(readerData);
        setHistory((historyData || []).map(normalizeHistoryRow));
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'Failed to load reader details.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this reader record?')) return;

    try {
      await readerService.deleteReader(id);
      navigate('/readers');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to delete reader.');
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading reader details...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!reader) {
    return <div className={styles.empty}>Reader record not found.</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>{reader.name}</h2>
          <p>{reader.readerNo || 'No reader number'} · {reader.department || 'No department'}</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.btn} onClick={() => navigate(`/readers/${id}/edit`)}>Edit Reader</button>
          <button className={`${styles.btn} ${styles.danger}`} onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <section className={styles.panel}>
        <h3 className={styles.sectionTitle}>Reader Profile</h3>
        <dl className={styles.detailGrid}>
          <div className={styles.detailItem}><dt>Reader No</dt><dd>{reader.readerNo || '-'}</dd></div>
          <div className={styles.detailItem}><dt>Status</dt><dd>{reader.status || '-'}</dd></div>
          <div className={styles.detailItem}><dt>Gender</dt><dd>{reader.gender || '-'}</dd></div>
          <div className={styles.detailItem}><dt>Phone</dt><dd>{reader.phone || '-'}</dd></div>
          <div className={styles.detailItem}><dt>Email</dt><dd>{reader.email || '-'}</dd></div>
          <div className={styles.detailItem}><dt>Department</dt><dd>{reader.department || '-'}</dd></div>
          <div className={styles.detailItem}><dt>Class</dt><dd>{reader.className || '-'}</dd></div>
          <div className={styles.detailItem}><dt>Max Borrow Count</dt><dd>{reader.maxBorrowCount || '-'}</dd></div>
          <div className={styles.detailItem}><dt>Created At</dt><dd>{formatDate(reader.createdAt)}</dd></div>
          <div className={styles.detailItem}><dt>Updated At</dt><dd>{formatDate(reader.updatedAt)}</dd></div>
          <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
            <dt>Remark</dt><dd>{reader.remark || '-'}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.panel}>
        <h3 className={styles.sectionTitle}>Borrow History</h3>
        {history.length === 0 ? (
          <div className={styles.empty}>No borrow history for this reader yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.bookTitle}</td>
                  <td>{formatDate(item.borrowDate)}</td>
                  <td>{formatDate(item.dueDate)}</td>
                  <td>{formatDate(item.returnDate)}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
