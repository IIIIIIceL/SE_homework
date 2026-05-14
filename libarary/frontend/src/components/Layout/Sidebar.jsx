import { NavLink } from 'react-router-dom';
import { menuConfig } from '../../config/menuConfig';
import styles from './Layout.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandPanel}>
        <p className={styles.kicker}>Library Workspace</p>
        <h1 className={styles.logo}>Library Admin</h1>
        <p className={styles.brandCopy}>One place for catalog changes, circulation work and status checks.</p>
      </div>

      <nav className={styles.nav} aria-label="Primary navigation">
        {menuConfig.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
          >
            <span className={styles.navLabel}>{item.label}</span>
            <span className={styles.navHint}>{item.description}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
