import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export default function Content() {
  return (
    <section className={styles.contentWrap}>
      <div className={styles.contentCard}>
        <Outlet />
      </div>
    </section>
  );
}
