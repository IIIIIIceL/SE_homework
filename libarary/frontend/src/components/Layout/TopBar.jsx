import Breadcrumb from '../Breadcrumb';
import styles from './Layout.module.css';

export default function TopBar({ userName, onLogout }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLead}>
        <p className={styles.topbarEyebrow}>Operations Console</p>
        <Breadcrumb />
      </div>

      <div className={styles.topbarActions}>
        <div className={styles.userBadge}>
          <span className={styles.userBadgeLabel}>Signed in as</span>
          <strong>{userName}</strong>
        </div>
        <button type="button" className={styles.logoutBtn} onClick={onLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
