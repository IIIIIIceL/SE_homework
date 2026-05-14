import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function Unauthorized() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f8fb'
      }}
    >
      <h1 style={{ fontSize: 72, margin: 0, color: '#d14343' }}>403</h1>
      <h2 style={{ margin: '16px 0 8px', color: '#17324d' }}>Access denied</h2>
      <p style={{ color: '#55708a', marginBottom: 24 }}>You do not have permission to view this page.</p>
      <Link
        to={ROUTES.root}
        style={{
          padding: '10px 24px',
          background: '#1f6feb',
          color: '#fff',
          borderRadius: 999,
          textDecoration: 'none'
        }}
      >
        Return home
      </Link>
    </div>
  );
}
