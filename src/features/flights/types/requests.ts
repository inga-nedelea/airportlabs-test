import type {
  FLIGHT_REQUEST_ERROR_CODES,
  FLIGHTS_ACTIONS,
} from '../constants/requests';
import type { FlightDataError } from '../errors/FlightDataError';
import type { FlightRequestError } from '../errors/FlightRequestError';
import type { Flight } from './flight';

export type FlightRequestErrorCode =
  (typeof FLIGHT_REQUEST_ERROR_CODES)[keyof typeof FLIGHT_REQUEST_ERROR_CODES];

export type FlightRequestErrorDetails = {
  status?: number;
  cause?: unknown;
};

export type FlightsError = FlightDataError | FlightRequestError;

export type FlightsState = {
  flights: Flight[];
  isLoading: boolean;
  error: FlightsError | null;
  lastSuccessAt: number | null;
};

export type FlightsAction =
  | { type: typeof FLIGHTS_ACTIONS.START }
  | {
      type: typeof FLIGHTS_ACTIONS.SUCCESS;
      flights: Flight[];
      lastSuccessAt: number;
    }
  | { type: typeof FLIGHTS_ACTIONS.FAILURE; error: FlightsError };

export type ActiveFlightRequest = {
  controller: AbortController;
  timeoutId: ReturnType<typeof setTimeout>;
};
