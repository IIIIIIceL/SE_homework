import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';
import styles from './AppLayout.module.css';

const menuItems = [
  { path: ROUTES.dashboard, label: 'Dashboard' },
  { path: ROUTES.books, label: 'Books' },
  { path: ROUTES.borrows, label: 'Borrows' }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.login);
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <h1 className={styles.logo}>Library Admin</h1>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <span>{user?.fullName || user?.username || 'User'}</span>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Sign out
          </button>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
