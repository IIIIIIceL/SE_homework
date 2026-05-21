import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';
import { getRoleName } from '../utils/roles';

export default function ProtectedRoute({ children, requiredRole, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        正在加载...
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?redirect=${redirect}`} replace />;
  }

  const roleName = getRoleName(user);

  if (requiredRole && roleName !== requiredRole) {
    return <Navigate to={ROUTES.unauthorized} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(roleName)) {
    return <Navigate to={ROUTES.unauthorized} replace />;
  }

  return children;
}
