import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import AppLayout from '../components/AppLayout';
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import ProtectedRoute from '../components/ProtectedRoute';
import BookList from '../pages/Books/List';
import BookDetail from '../pages/Books/Detail';
import BookCreate from '../pages/Books/Create';
import BookEdit from '../pages/Books/Edit';
import BorrowList from '../pages/Borrows/List';
import BorrowDetail from '../pages/Borrows/Detail';
import BorrowBook from '../pages/Borrows/Borrow';
import Overdue from '../pages/Borrows/Overdue';

function DashboardHome() {
  return (
    <div>
      <h2>欢迎使用图书管理系统</h2>
      <p>请在左侧导航栏选择功能模块。</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      { path: 'login', element: <Login /> },
      { path: 'unauthorized', element: <Unauthorized /> },

      // Protected routes with layout
      {
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: 'dashboard', element: <DashboardHome /> },

          // Book management
          { path: 'books', element: <BookList /> },
          { path: 'books/create', element: <BookCreate /> },
          { path: 'books/:id', element: <BookDetail /> },
          { path: 'books/:id/edit', element: <BookEdit /> },

          // Borrow management
          { path: 'borrows', element: <BorrowList /> },
          { path: 'borrows/borrow', element: <BorrowBook /> },
          { path: 'borrows/overdue', element: <Overdue /> },
          { path: 'borrows/:id', element: <BorrowDetail /> }
        ]
      }
    ]
  }
]);

export default router;
