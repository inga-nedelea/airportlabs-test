import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { fetchFlights } from '../api/fetchFlights';
import {
  FLIGHTS_ACTIONS,
  FLIGHTS_REFRESH_INTERVAL_MS,
  FLIGHTS_REQUEST_TIMEOUT_MS,
  FLIGHT_REQUEST_ERROR_CODES,
} from '../constants/requests';
import { FlightRequestError } from '../errors/FlightRequestError';
import type { ActiveFlightRequest } from '../types/requests';
import { createSessionAirportDate } from '../utils/createSessionAirportDate';
import {
  flightsReducer,
  initialFlightsState,
  toFlightsError,
} from './flightsReducer';
import { useFlightFailureDemo } from './useFlightFailureDemo';

export function useFlights() {
  const [sessionAirportDate] = useState(createSessionAirportDate);
  const [state, dispatch] = useReducer(flightsReducer, initialFlightsState);
  const activeRequest = useRef<ActiveFlightRequest | null>(null);
  const { isFailureArmed, armFailure, consumeFailure, startWithReloadCheck } =
    useFlightFailureDemo();

  const cancelActiveRequest = useCallback(() => {
    const request = activeRequest.current;

    activeRequest.current = null;

    if (request) {
      clearTimeout(request.timeoutId);
      request.controller.abort();
    }
  }, []);

  const finishRequest = useCallback((request: ActiveFlightRequest) => {
    if (activeRequest.current !== request) {
      return false;
    }

    clearTimeout(request.timeoutId);
    activeRequest.current = null;

    return true;
  }, []);

  const refresh = useCallback(() => {
    cancelActiveRequest();

    const controller = new AbortController();
    const request: ActiveFlightRequest = {
      controller,
      timeoutId: setTimeout(() => {
        if (!finishRequest(request)) {
          return;
        }

        controller.abort();
        dispatch({
          type: FLIGHTS_ACTIONS.FAILURE,
          error: new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.TIMEOUT),
        });
      }, FLIGHTS_REQUEST_TIMEOUT_MS),
    };

    activeRequest.current = request;
    dispatch({ type: FLIGHTS_ACTIONS.START });

    const result = consumeFailure()
      ? Promise.reject(
          new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.SIMULATED),
        )
      : fetchFlights(controller.signal, sessionAirportDate);

    void result.then(
      (flights) => {
        if (!finishRequest(request)) {
          return;
        }

        dispatch({
          type: FLIGHTS_ACTIONS.SUCCESS,
          flights,
          lastSuccessAt: Date.now(),
        });
      },
      (cause: unknown) => {
        if (!finishRequest(request)) {
          return;
        }

        dispatch({
          type: FLIGHTS_ACTIONS.FAILURE,
          error: toFlightsError(cause),
        });
      },
    );
  }, [cancelActiveRequest, consumeFailure, finishRequest, sessionAirportDate]);

  useEffect(() => {
    const stopReloadCheck = startWithReloadCheck(refresh);
    const intervalId = setInterval(refresh, FLIGHTS_REFRESH_INTERVAL_MS);

    return () => {
      stopReloadCheck();
      clearInterval(intervalId);
      cancelActiveRequest();
    };
  }, [cancelActiveRequest, refresh, startWithReloadCheck]);

  return {
    ...state,
    refresh,
    isFailureArmed,
    armFailure,
  };
}
