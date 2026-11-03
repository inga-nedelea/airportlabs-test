import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { fetchFlights } from '../api/fetchFlights';
import {
  FLIGHTS_ACTIONS,
  FLIGHTS_FAIL_ON_RELOAD_KEY,
  FLIGHTS_REFRESH_INTERVAL_MS,
  FLIGHTS_REQUEST_TIMEOUT_MS,
  FLIGHT_REQUEST_ERROR_CODES,
} from '../constants/requests';
import { FlightDataError } from '../errors/FlightDataError';
import { FlightRequestError } from '../errors/FlightRequestError';
import type {
  ActiveFlightRequest,
  FlightsAction,
  FlightsState,
} from '../types/requests';
import { createSessionAirportDate } from '../utils/createSessionAirportDate';

const initialState: FlightsState = {
  flights: [],
  isLoading: true,
  error: null,
  lastSuccessAt: null,
};

function flightsReducer(
  state: FlightsState,
  action: FlightsAction,
): FlightsState {
  switch (action.type) {
    case FLIGHTS_ACTIONS.START:
      return { ...state, isLoading: true };
    case FLIGHTS_ACTIONS.SUCCESS:
      return {
        flights: action.flights,
        isLoading: false,
        error: null,
        lastSuccessAt: action.lastSuccessAt,
      };
    case FLIGHTS_ACTIONS.FAILURE:
      return { ...state, isLoading: false, error: action.error };
  }
}

function getFailureReloadStorage() {
  try {
    const { sessionStorage } = window;

    return sessionStorage.getItem(FLIGHTS_FAIL_ON_RELOAD_KEY) === null
      ? null
      : sessionStorage;
  } catch {
    return null;
  }
}

export function useFlights() {
  const [sessionAirportDate] = useState(createSessionAirportDate);
  const [state, dispatch] = useReducer(flightsReducer, initialState);
  const [isFailureArmed, setIsFailureArmed] = useState(false);
  const failNextRequest = useRef(false);
  const activeRequest = useRef<ActiveFlightRequest | null>(null);
  const mounted = useRef(false);

  function armFailure() {
    failNextRequest.current = true;
    setIsFailureArmed(true);
  }

  const cancelActiveRequest = useCallback(() => {
    const request = activeRequest.current;

    activeRequest.current = null;

    if (request) {
      clearTimeout(request.timeoutId);
      request.controller.abort();
    }
  }, []);

  const refresh = useCallback(() => {
    if (!mounted.current) {
      return;
    }

    cancelActiveRequest();

    const controller = new AbortController();
    const request: ActiveFlightRequest = {
      controller,
      timeoutId: setTimeout(() => {
        if (activeRequest.current !== request || !mounted.current) {
          return;
        }

        cancelActiveRequest();
        dispatch({
          type: FLIGHTS_ACTIONS.FAILURE,
          error: new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.TIMEOUT),
        });
      }, FLIGHTS_REQUEST_TIMEOUT_MS),
    };

    activeRequest.current = request;
    dispatch({ type: FLIGHTS_ACTIONS.START });

    const shouldFail = failNextRequest.current;

    if (shouldFail) {
      failNextRequest.current = false;
      setIsFailureArmed(false);
    }

    const result = shouldFail
      ? Promise.reject(
          new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.SIMULATED),
        )
      : fetchFlights(controller.signal, sessionAirportDate);

    void result.then(
      (flights) => {
        if (activeRequest.current !== request || !mounted.current) {
          return;
        }

        clearTimeout(request.timeoutId);
        activeRequest.current = null;
        dispatch({
          type: FLIGHTS_ACTIONS.SUCCESS,
          flights,
          lastSuccessAt: Date.now(),
        });
      },
      (cause: unknown) => {
        if (activeRequest.current !== request || !mounted.current) {
          return;
        }

        clearTimeout(request.timeoutId);
        activeRequest.current = null;

        const error =
          cause instanceof FlightDataError ||
          cause instanceof FlightRequestError
            ? cause
            : new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.NETWORK, {
                cause,
              });

        dispatch({ type: FLIGHTS_ACTIONS.FAILURE, error });
      },
    );
  }, [cancelActiveRequest, sessionAirportDate]);

  useEffect(() => {
    let cancelled = false;
    const failureReloadStorage = getFailureReloadStorage();

    mounted.current = true;

    if (failureReloadStorage === null) {
      refresh();
    } else {
      // Keep the one-shot marker through Strict Mode's discarded setup.
      queueMicrotask(() => {
        if (cancelled) {
          return;
        }

        failureReloadStorage.removeItem(FLIGHTS_FAIL_ON_RELOAD_KEY);
        failNextRequest.current = true;
        refresh();
      });
    }

    const intervalId = setInterval(refresh, FLIGHTS_REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      mounted.current = false;
      clearInterval(intervalId);
      cancelActiveRequest();
    };
  }, [cancelActiveRequest, refresh]);

  return {
    ...state,
    refresh,
    isFailureArmed,
    armFailure,
  };
}
