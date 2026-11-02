import { Link } from 'react-router';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <h1>Not Found</h1>
      <p>The page you requested could not be found.</p>
      <Link className={styles.homeLink} to="/">
        Go to flight board
      </Link>
    </main>
  );
}
