import {
  FLIGHTS_ACTIONS,
  FLIGHT_REQUEST_ERROR_CODES,
} from '../constants/requests';
import { FlightDataError } from '../errors/FlightDataError';
import { FlightRequestError } from '../errors/FlightRequestError';
import type {
  FlightsAction,
  FlightsError,
  FlightsState,
} from '../types/requests';

export const initialFlightsState: FlightsState = {
  flights: [],
  isLoading: true,
  error: null,
  lastSuccessAt: null,
};

export function flightsReducer(
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

export function toFlightsError(cause: unknown): FlightsError {
  if (cause instanceof FlightDataError || cause instanceof FlightRequestError) {
    return cause;
  }

  return new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.NETWORK, { cause });
}
