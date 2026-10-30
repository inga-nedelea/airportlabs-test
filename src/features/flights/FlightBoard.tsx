import styles from './FlightBoard.module.css';

export function FlightBoard() {
  return (
    <main className={styles.board}>
      <p className={styles.eyebrow}>Airport operations</p>
      <h1>Flight status board</h1>
      <p>
        The project foundation is ready. Flight data, filtering, and live
        refresh will be added in the next implementation phase.
      </p>
    </main>
  );
}
