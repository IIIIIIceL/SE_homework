import { NavLink } from 'react-router-dom';
import { menuConfig } from '../../config/menuConfig';
import styles from './Layout.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandPanel}>
        <p className={styles.kicker}>图书馆工作台</p>
        <h1 className={styles.logo}>图书管理系统</h1>
        <p className={styles.brandCopy}>集中处理书目维护、流通借阅和系统状态检查。</p>
      </div>

      <nav className={styles.nav} aria-label="主导航">
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
