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
    <div>
      <h2>欢迎使用图书管理系统</h2>
      <p>请从左侧导航菜单选择需要办理的业务模块。</p>
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
