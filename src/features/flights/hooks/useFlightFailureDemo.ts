import { useCallback, useRef, useState } from 'react';
import { FLIGHTS_FAIL_ON_RELOAD_KEY } from '../constants/requests';

function hasFailureReloadMarker() {
  try {
    return window.sessionStorage.getItem(FLIGHTS_FAIL_ON_RELOAD_KEY) !== null;
  } catch {
    return false;
  }
}

function consumeFailureReloadMarker() {
  window.sessionStorage.removeItem(FLIGHTS_FAIL_ON_RELOAD_KEY);
}

export function useFlightFailureDemo() {
  const [isFailureArmed, setIsFailureArmed] = useState(false);
  const failNextRequest = useRef(false);

  function armFailure() {
    failNextRequest.current = true;
    setIsFailureArmed(true);
  }

  const consumeFailure = useCallback(() => {
    if (!failNextRequest.current) {
      return false;
    }

    failNextRequest.current = false;
    setIsFailureArmed(false);

    return true;
  }, []);

  const startWithReloadCheck = useCallback((refresh: () => void) => {
    let cancelled = false;

    if (hasFailureReloadMarker()) {
      // Keep the one-shot marker through Strict Mode's discarded setup.
      queueMicrotask(() => {
        if (cancelled) {
          return;
        }

        consumeFailureReloadMarker();
        failNextRequest.current = true;
        refresh();
      });
    } else {
      refresh();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    isFailureArmed,
    armFailure,
    consumeFailure,
    startWithReloadCheck,
  };
}
