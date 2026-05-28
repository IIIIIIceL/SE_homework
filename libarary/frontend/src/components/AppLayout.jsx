import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';
import Content from './Layout/Content';
import Sidebar from './Layout/Sidebar';
import TopBar from './Layout/TopBar';
import styles from './Layout/Layout.module.css';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.login);
  }

  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        <TopBar userName={user?.fullName || user?.username || '用户'} onLogout={handleLogout} />
        <Content />
      </main>
    </div>
  );
}
