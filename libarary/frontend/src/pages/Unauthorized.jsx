import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: 72, margin: 0, color: '#ff4d4f' }}>403</h1>
      <h2 style={{ margin: '16px 0 8px', color: '#333' }}>权限不足</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>您没有权限访问此页面</p>
      <Link to="/" style={{
        padding: '10px 24px',
        background: '#1890ff',
        color: '#fff',
        borderRadius: 4,
        textDecoration: 'none'
      }}>
        返回首页
      </Link>
    </div>
  );
}
