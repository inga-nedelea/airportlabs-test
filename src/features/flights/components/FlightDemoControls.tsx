import { useState } from 'react';
import {
  FLIGHTS_FAIL_ON_RELOAD_KEY,
  FLIGHTS_FAILURE_RELOAD_UNAVAILABLE_MESSAGE,
} from '../constants/requests';
import type { FlightDemoControlsProps } from '../types/presentation';
import styles from './FlightDemoControls.module.css';

export function FlightDemoControls({
  isFailureArmed,
  armFailure,
}: FlightDemoControlsProps) {
  const [reloadUnavailable, setReloadUnavailable] = useState(false);

  function reloadWithSimulatedFailure() {
    try {
      window.sessionStorage.setItem(FLIGHTS_FAIL_ON_RELOAD_KEY, '1');
    } catch {
      setReloadUnavailable(true);

      return;
    }

    window.location.reload();
  }

  return (
    <details className={styles.demo}>
      <summary>
        Demo controls{' '}
        <span className={styles.armed} role="status">
          {isFailureArmed && 'Failure armed'}
        </span>
      </summary>
      <p>
        {isFailureArmed
          ? 'The next manual or automatic refresh will fail once.'
          : 'Arm a one-time failure for the next manual or automatic refresh.'}
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={armFailure}>
          Fail next request
        </button>
        <button type="button" onClick={reloadWithSimulatedFailure}>
          Reload with a simulated failure
        </button>
      </div>
      {reloadUnavailable && (
        <p role="alert">{FLIGHTS_FAILURE_RELOAD_UNAVAILABLE_MESSAGE}</p>
      )}
    </details>
  );
}
