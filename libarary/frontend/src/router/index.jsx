import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import ProtectedRoute from '../components/ProtectedRoute';

// Placeholder dashboard — will be replaced by FE-03/FE-04
function DashboardPlaceholder() {
  return (
    <div style={{ padding: 24 }}>
      <h2>欢迎使用图书管理系统</h2>
      <p>登录成功！更多功能将在后续迭代中上线。</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        )
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />
      }
    ]
  }
]);

export default router;
