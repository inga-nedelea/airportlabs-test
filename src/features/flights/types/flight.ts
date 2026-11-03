import type { FLIGHT_STATUSES } from '../constants/flight';

export type FlightStatus =
  (typeof FLIGHT_STATUSES)[keyof typeof FLIGHT_STATUSES];

export type FlightPost = {
  id: number;
  userId: number;
  title: string;
};

// Airport civil time, not an instant to parse with the viewer's local Date.
export type AirportDeparture = {
  date: string;
  minutesAfterMidnight: number;
};

export type Flight = {
  flightNumber: string;
  destination: string;
  status: FlightStatus;
  gate: string;
  terminal: number;
  departure: AirportDeparture;
};

export type TerminalFlightGroup = {
  terminal: number;
  flights: Flight[];
};
