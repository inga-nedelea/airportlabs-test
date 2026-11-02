import {
  FLIGHT_DATA_ERROR_MESSAGES,
  FLIGHT_POST_FIELD_ERROR_MESSAGES,
} from '../constants/errors';
import type {
  FlightDataErrorCode,
  FlightDataErrorDetails,
} from '../types/errors';
import type { FlightPost } from '../types/flight';

export class FlightDataError extends Error {
  readonly code: FlightDataErrorCode;
  readonly field?: keyof FlightPost;
  readonly duplicateId?: number;

  constructor(code: FlightDataErrorCode, details: FlightDataErrorDetails = {}) {
    const message = details.field
      ? FLIGHT_POST_FIELD_ERROR_MESSAGES[details.field]
      : FLIGHT_DATA_ERROR_MESSAGES[code];

    super(message, { cause: details.cause });

    this.name = 'FlightDataError';
    this.code = code;
    this.field = details.field;
    this.duplicateId = details.duplicateId;
  }
}
