export const FLIGHTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';
export const FLIGHTS_REFRESH_INTERVAL_MS = 30_000;
export const FLIGHTS_REQUEST_TIMEOUT_MS = 10_000;

export const FLIGHT_REQUEST_ERROR_CODES = {
  NETWORK: 'NETWORK',
  HTTP: 'HTTP',
  DECODE: 'DECODE',
  TIMEOUT: 'TIMEOUT',
} as const;

export const FLIGHT_REQUEST_ERROR_MESSAGES = {
  NETWORK: 'Unable to reach the flight service. Try again.',
  HTTP: 'The flight service returned an unsuccessful response. Try again.',
  DECODE: 'The flight service returned unreadable JSON. Try again.',
  TIMEOUT: 'The flight request timed out after 10 seconds. Try again.',
} as const;

export const FLIGHTS_ACTIONS = {
  START: 'START',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
} as const;
