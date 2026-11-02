import {
  FLIGHTS_API_URL,
  FLIGHT_REQUEST_ERROR_CODES,
} from '../constants/requests';
import { FlightRequestError } from '../errors/FlightRequestError';
import { mapFlightResponse } from '../mapping/mapFlightResponse';
import type { Flight } from '../types/flight';

export async function fetchFlights(
  signal: AbortSignal,
  sessionAirportDate: string,
): Promise<Flight[]> {
  let response: Response;

  try {
    response = await fetch(FLIGHTS_API_URL, { signal });
  } catch (cause) {
    throw new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.NETWORK, { cause });
  }

  if (!response.ok) {
    throw new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.HTTP, {
      status: response.status,
    });
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch (cause) {
    throw new FlightRequestError(FLIGHT_REQUEST_ERROR_CODES.DECODE, { cause });
  }

  return mapFlightResponse(payload, sessionAirportDate);
}
