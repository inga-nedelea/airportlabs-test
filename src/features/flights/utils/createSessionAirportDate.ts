import { AIRPORT_TIME_ZONE } from '../constants/flight';
import { FLIGHT_DATA_ERROR_CODES } from '../constants/errors';
import { FlightDataError } from '../errors/FlightDataError';

export function createSessionAirportDate(now = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: AIRPORT_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);

    function part(type: Intl.DateTimeFormatPartTypes): string {
      const value = parts.find((entry) => entry.type === type)?.value;

      if (!value) {
        throw new FlightDataError(FLIGHT_DATA_ERROR_CODES.AIRPORT_DATE);
      }

      return value;
    }

    return `${part('year')}-${part('month')}-${part('day')}`;
  } catch (cause) {
    if (cause instanceof FlightDataError) {
      throw cause;
    }

    throw new FlightDataError(FLIGHT_DATA_ERROR_CODES.AIRPORT_DATE, { cause });
  }
}
