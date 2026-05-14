import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirect = searchParams.get('redirect') || ROUTES.root;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Library Management</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
