export const AIRPORT_TIME_ZONE = 'Europe/Chisinau';
export const FLIGHT_NUMBER_PREFIX = 'FL-';
export const GATE_PREFIX = 'G-';

export const FLIGHT_STATUSES = {
  ON_TIME: 'On Time',
  DELAYED: 'Delayed',
  CANCELLED: 'Cancelled',
} as const;

export const FLIGHT_STATUS_PARAM = 'status';
export const ALL_FLIGHT_STATUSES = '';
export const FLIGHT_STATUS_OPTIONS = [
  { value: 'on-time', label: FLIGHT_STATUSES.ON_TIME },
  { value: 'delayed', label: FLIGHT_STATUSES.DELAYED },
  { value: 'cancelled', label: FLIGHT_STATUSES.CANCELLED },
] as const;

export const FLIGHT_SEARCH_PARAM = 'q';
export const FLIGHT_GROUPING_PARAM = 'groupBy';
export const FLIGHT_GROUPING_OPTIONS = [
  { value: 'terminal', label: 'Terminal' },
  { value: 'gate', label: 'Gate' },
] as const;

export const FIRST_DEPARTURE_MINUTES = 6 * 60;
export const DEPARTURE_INTERVAL_MINUTES = 5;
// Five-minute slots from 06:00 through 23:55, inclusive.
export const DEPARTURE_SLOT_COUNT = 216;
export const GATE_COUNT = 20;
export const CANCELLED_FLIGHT_INTERVAL = 10;
export const DELAYED_FLIGHT_INTERVAL = 3;
