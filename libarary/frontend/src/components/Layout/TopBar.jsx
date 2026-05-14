import Breadcrumb from '../Breadcrumb';
import styles from './Layout.module.css';

export default function TopBar({ userName, onLogout }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLead}>
        <p className={styles.topbarEyebrow}>图书馆业务控制台</p>
        <Breadcrumb />
      </div>

      <div className={styles.topbarActions}>
        <div className={styles.userBadge}>
          <span className={styles.userBadgeLabel}>当前用户</span>
          <strong>{userName}</strong>
        </div>
        <button type="button" className={styles.logoutBtn} onClick={onLogout}>
          退出登录
        </button>
      </div>
    </header>
  );
}
