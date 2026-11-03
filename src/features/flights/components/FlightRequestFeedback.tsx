import {
  FLIGHTS_REFRESH_INTERVAL_MS,
  FLIGHT_REQUEST_ERROR_CODES,
} from '../constants/requests';
import { FlightRequestError } from '../errors/FlightRequestError';
import type { FlightRequestFeedbackProps } from '../types/presentation';
import { formatLastSuccessTime } from '../utils/formatFlightTime';
import styles from './FlightRequestFeedback.module.css';

const MILLISECONDS_PER_SECOND = 1000;
const refreshIntervalSeconds =
  FLIGHTS_REFRESH_INTERVAL_MS / MILLISECONDS_PER_SECOND;

export function FlightRequestFeedback({
  isLoading,
  error,
  lastSuccessAt,
  refresh,
}: FlightRequestFeedbackProps) {
  const hasSuccess = lastSuccessAt !== null;
  const isSimulatedFailure =
    error instanceof FlightRequestError &&
    error.code === FLIGHT_REQUEST_ERROR_CODES.SIMULATED;
  let requestMessage = 'Flight information is up to date.';

  if (error) {
    requestMessage = 'Waiting for the next automatic retry.';
  }

  if (isLoading) {
    requestMessage = hasSuccess ? 'Refreshing flights…' : 'Loading flights…';
  }

  return (
    <section className={styles.feedback} aria-label="Flight updates">
      <div className={styles.controls}>
        <div>
          <p className={styles.requestStatus} role="status">
            {requestMessage}
          </p>
          <p className={styles.metadata}>
            {hasSuccess ? (
              <>
                Last successful update:{' '}
                <time dateTime={new Date(lastSuccessAt).toISOString()}>
                  {formatLastSuccessTime(lastSuccessAt)}
                </time>
                .
              </>
            ) : (
              'No successful update yet.'
            )}{' '}
            Automatic refresh every {refreshIntervalSeconds} seconds.
          </p>
        </div>
        <button type="button" onClick={refresh} className={styles.refresh}>
          Refresh
        </button>
      </div>
      {error && (
        <div className={styles.warning} role="alert">
          <div>
            <p className={styles.warningTitle}>
              {hasSuccess
                ? 'Flight information may be stale.'
                : 'Unable to load flights.'}
            </p>
            {isSimulatedFailure && <p>{error.message}</p>}
            <p>
              {hasSuccess && 'Showing the last successful information. '}
              Automatic retries will continue.
            </p>
          </div>
          <button type="button" onClick={refresh} className={styles.retry}>
            Retry now
          </button>
        </div>
      )}
    </section>
  );
}
