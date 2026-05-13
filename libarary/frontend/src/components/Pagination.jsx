import styles from './Pagination.module.css';

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className={styles.container}>
      <span className={styles.info}>共 {total} 条</span>
      <button className={styles.btn} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>上一页</button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className={styles.ellipsis}>...</span>
        ) : (
          <button
            key={p}
            className={`${styles.btn} ${p === page ? styles.active : ''}`}
            onClick={() => onPageChange(p)}
          >{p}</button>
        )
      )}
      <button className={styles.btn} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>下一页</button>
    </div>
  );
}
