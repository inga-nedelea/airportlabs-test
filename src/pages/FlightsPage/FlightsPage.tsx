import { FlightBoard } from '../../features/flights/components/FlightBoard';
import { FlightDemoControls } from '../../features/flights/components/FlightDemoControls';
import { FlightRequestFeedback } from '../../features/flights/components/FlightRequestFeedback';
import { AIRPORT_TIME_ZONE } from '../../features/flights/constants/flight';
import { useFlightBoard } from '../../features/flights/hooks/useFlightBoard';
import { useFlights } from '../../features/flights/hooks/useFlights';
import styles from './FlightsPage.module.css';

export function FlightsPage() {
  const {
    flights,
    isLoading,
    error,
    lastSuccessAt,
    refresh,
    isFailureArmed,
    armFailure,
  } = useFlights();
  const flightBoard = useFlightBoard(flights);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Airport operations</p>
        <h1>Departures</h1>
        <p>All times in {AIRPORT_TIME_ZONE} · 24-hour clock</p>
      </header>
      <FlightRequestFeedback
        isLoading={isLoading}
        error={error}
        lastSuccessAt={lastSuccessAt}
        refresh={refresh}
      />
      <FlightDemoControls
        isFailureArmed={isFailureArmed}
        armFailure={armFailure}
      />
      {lastSuccessAt !== null && <FlightBoard {...flightBoard} />}
    </main>
  );
}
