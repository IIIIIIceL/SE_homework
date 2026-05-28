import { NavLink } from 'react-router-dom';
import { adminMenuConfig, readerMenuConfig } from '../../config/menuConfig';
import { useAuth } from '../../context/AuthContext';
import { getRoleName, isAdminRole } from '../../utils/roles';
import styles from './Layout.module.css';

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = isAdminRole(getRoleName(user));
  const menuConfig = isAdmin ? adminMenuConfig : readerMenuConfig;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandPanel}>
        <p className={styles.kicker}>{isAdmin ? '图书馆工作台' : '读者服务台'}</p>
        <h1 className={styles.logo}>{isAdmin ? '图书管理系统' : '我的图书馆'}</h1>
        <p className={styles.brandCopy}>
          {isAdmin ? '集中处理书目维护、流通借阅和系统状态检查。' : '检索馆藏、查看借阅，并管理自己的读者资料。'}
        </p>
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
