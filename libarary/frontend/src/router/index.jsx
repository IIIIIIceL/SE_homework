import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';
import { getHomeRouteForUser } from '../utils/roles';
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
import ReaderDashboard from '../pages/ReaderPortal/Dashboard';
import ReaderBookSearch from '../pages/ReaderPortal/BookSearch';
import ReaderBookDetail from '../pages/ReaderPortal/BookDetail';
import MyBorrows from '../pages/ReaderPortal/MyBorrows';
import ReaderProfile from '../pages/ReaderPortal/Profile';

const ADMIN_ROLES = ['ADMIN'];
const READER_ROLES = ['LIBRARIAN'];

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomeRouteForUser(user)} replace />;
}

function DashboardHome() {
  const items = [
    { title: 'Books', desc: 'Maintain catalog, inventory and shelf status.', path: ROUTES.books },
    { title: 'Readers', desc: 'Maintain reader profiles and borrow limits.', path: ROUTES.readers },
    { title: 'Borrows', desc: 'Handle borrowing, returns, renewals and overdue records.', path: ROUTES.borrows },
    { title: 'System', desc: 'Manage users, roles and operation logs.', path: ROUTES.systemDashboard }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid var(--color-border)' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 12px' }}>
          Admin Console
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', margin: 0 }}>
          Manage books, readers, circulation and system settings.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <a key={item.path} href={item.path} style={{ display: 'block', padding: 24, borderRadius: 12, background: '#fff', border: '1px solid var(--color-border)', textDecoration: 'none' }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-text)' }}>{item.title}</h3>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{item.desc}</p>
          </a>
        ))}
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
      { index: true, element: <ProtectedRoute><HomeRedirect /></ProtectedRoute> },
      {
        element: (
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
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
      },
      {
        element: (
          <ProtectedRoute allowedRoles={READER_ROLES}>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: ROUTES.readerHome.slice(1), element: <ReaderDashboard /> },
          { path: ROUTES.readerBooks.slice(1), element: <ReaderBookSearch /> },
          { path: 'reader/books/:id', element: <ReaderBookDetail /> },
          { path: ROUTES.readerBorrows.slice(1), element: <MyBorrows /> },
          { path: ROUTES.readerProfile.slice(1), element: <ReaderProfile /> }
        ]
      }
    ]
  }
]);

export default router;
