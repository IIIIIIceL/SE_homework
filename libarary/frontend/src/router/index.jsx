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
import BorrowList from '../pages/Borrows/List';
import BorrowDetail from '../pages/Borrows/Detail';
import BorrowBook from '../pages/Borrows/Borrow';
import Overdue from '../pages/Borrows/Overdue';

function DashboardHome() {
  return (
    <div>
      <h2>Welcome to the library management system</h2>
      <p>Please choose a module from the navigation menu.</p>
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
          { path: ROUTES.borrows.slice(1), element: <BorrowList /> },
          { path: ROUTES.borrowBook.slice(1), element: <BorrowBook /> },
          { path: ROUTES.overdueBorrows.slice(1), element: <Overdue /> },
          { path: 'borrows/:id', element: <BorrowDetail /> }
        ]
      }
    ]
  }
]);

export default router;
