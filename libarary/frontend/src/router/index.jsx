import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from '../constants/routes';
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import BookList from '../pages/Books/List';
import BookDetail from '../pages/Books/Detail';
import BookCreate from '../pages/Books/Create';
import BookEdit from '../pages/Books/Edit';
import ReaderList from '../pages/Readers/List';
import ReaderDetail from '../pages/Readers/Detail';
import ReaderCreate from '../pages/Readers/Create';
import ReaderEdit from '../pages/Readers/Edit';
import BorrowList from '../pages/Borrows/List';
import BorrowDetail from '../pages/Borrows/Detail';
import BorrowBook from '../pages/Borrows/Borrow';
import Overdue from '../pages/Borrows/Overdue';
import SystemDashboard from '../pages/System/Dashboard';
import RolesPage from '../pages/System/Roles';
import UsersPage from '../pages/System/Users';
import LogsPage from '../pages/System/Logs';

function DashboardHome() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* 欢迎区域 */}
      <div style={{
        marginBottom: '40px',
        paddingBottom: '32px',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: '0 0 12px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          欢迎使用图书管理系统
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--color-text-muted)',
          margin: 0
        }}>
          集中处理书目维护、流通借阅和系统状态检查
        </p>
      </div>

      {/* 快速操作卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {[
          { icon: '📚', title: '图书管理', desc: '浏览、创建和管理图书信息', path: '/books' },
          { icon: '👥', title: '读者管理', desc: '维护读者账户和相关信息', path: '/readers' },
          { icon: '🔄', title: '借阅管理', desc: '处理图书借阅和还书业务', path: '/borrows' },
          { icon: '⚙️', title: '系统管理', desc: '管理用户、角色和系统日志', path: '/system' }
        ].map((item, idx) => (
          <a
            key={idx}
            href={item.path}
            style={{
              display: 'block',
              padding: '24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(0, 168, 113, 0.08) 0%, rgba(79, 179, 163, 0.06) 100%)',
              border: '1px solid var(--color-border)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 168, 113, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 8px'
            }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-text-muted)',
              margin: 0
            }}>
              {item.desc}
            </p>
          </a>
        ))}
      </div>

      {/* 提示信息 */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(0, 168, 113, 0.1) 0%, rgba(79, 179, 163, 0.08) 100%)',
        border: '1px solid var(--color-accent-light)',
        color: 'var(--color-text)'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          💡 提示：请从上方卡片选择需要办理的业务模块，或使用左侧导航菜单进行操作。
        </p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: <App />,
    children: [
      { path: ROUTES.login.slice(1), element: <Login /> },
      { path: ROUTES.unauthorized.slice(1), element: <Unauthorized /> },
      {
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: ROUTES.dashboard.slice(1), element: <DashboardHome /> },
          { path: ROUTES.books.slice(1), element: <BookList /> },
          { path: ROUTES.createBook.slice(1), element: <BookCreate /> },
          { path: 'books/:id', element: <BookDetail /> },
          { path: 'books/:id/edit', element: <BookEdit /> },
          { path: ROUTES.readers.slice(1), element: <ReaderList /> },
          { path: ROUTES.createReader.slice(1), element: <ReaderCreate /> },
          { path: 'readers/:id', element: <ReaderDetail /> },
          { path: 'readers/:id/edit', element: <ReaderEdit /> },
          { path: ROUTES.borrows.slice(1), element: <BorrowList /> },
          { path: ROUTES.borrowBook.slice(1), element: <BorrowBook /> },
          { path: ROUTES.overdueBorrows.slice(1), element: <Overdue /> },
          { path: 'borrows/:id', element: <BorrowDetail /> },
          { path: ROUTES.systemDashboard.slice(1), element: <SystemDashboard /> },
          { path: ROUTES.systemRoles.slice(1), element: <RolesPage /> },
          { path: ROUTES.systemUsers.slice(1), element: <UsersPage /> },
          { path: ROUTES.systemLogs.slice(1), element: <LogsPage /> }
        ]
      }
    ]
  }
]);

export default router;
