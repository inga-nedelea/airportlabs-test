import { AIRPORT_TIME_ZONE } from '../constants/flight';

const MINUTES_PER_HOUR = 60;
const CLOCK_DIGITS = 2;
const lastSuccessFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: AIRPORT_TIME_ZONE,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function formatDepartureTime(minutesAfterMidnight: number) {
  const hours = Math.floor(minutesAfterMidnight / MINUTES_PER_HOUR);
  const minutes = minutesAfterMidnight % MINUTES_PER_HOUR;
  const hourText = String(hours).padStart(CLOCK_DIGITS, '0');
  const minuteText = String(minutes).padStart(CLOCK_DIGITS, '0');

  return `${hourText}:${minuteText}`;
}

export function formatLastSuccessTime(timestamp: number) {
  return lastSuccessFormatter.format(timestamp);
}
