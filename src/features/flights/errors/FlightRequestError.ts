import { FLIGHT_REQUEST_ERROR_MESSAGES } from '../constants/requests';
import type {
  FlightRequestErrorCode,
  FlightRequestErrorDetails,
} from '../types/requests';

export class FlightRequestError extends Error {
  readonly code: FlightRequestErrorCode;
  readonly status?: number;

  constructor(
    code: FlightRequestErrorCode,
    details: FlightRequestErrorDetails = {},
  ) {
    super(FLIGHT_REQUEST_ERROR_MESSAGES[code], { cause: details.cause });

    this.name = 'FlightRequestError';
    this.code = code;
    this.status = details.status;
  }
}
