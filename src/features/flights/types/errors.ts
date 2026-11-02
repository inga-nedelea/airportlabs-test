import type { FLIGHT_DATA_ERROR_CODES } from '../constants/errors';
import type { FlightPost } from './flight';

export type FlightDataErrorCode =
  (typeof FLIGHT_DATA_ERROR_CODES)[keyof typeof FLIGHT_DATA_ERROR_CODES];

export type FlightDataErrorDetails = {
  field?: keyof FlightPost;
  duplicateId?: number;
  cause?: unknown;
};
