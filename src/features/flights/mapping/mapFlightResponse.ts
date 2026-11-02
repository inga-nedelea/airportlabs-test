import {
  CANCELLED_FLIGHT_INTERVAL,
  DELAYED_FLIGHT_INTERVAL,
  DEPARTURE_INTERVAL_MINUTES,
  DEPARTURE_SLOT_COUNT,
  FIRST_DEPARTURE_MINUTES,
  FLIGHT_NUMBER_PREFIX,
  FLIGHT_STATUSES,
  GATE_COUNT,
  GATE_PREFIX,
} from '../constants/flight';
import type {
  AirportDeparture,
  Flight,
  FlightPost,
  FlightStatus,
} from '../types/flight';
import { validateFlightPosts } from '../utils/validateFlightPosts';

function deriveFlightStatus(id: number): FlightStatus {
  if (id % CANCELLED_FLIGHT_INTERVAL === 0) {
    return FLIGHT_STATUSES.CANCELLED;
  }

  if (id % DELAYED_FLIGHT_INTERVAL === 0) {
    return FLIGHT_STATUSES.DELAYED;
  }

  return FLIGHT_STATUSES.ON_TIME;
}

function deriveGate(id: number): string {
  // Cycle through the available gates: flight IDs 1, 20, 21 use gates 1, 20, 1.
  const flightIndex = id - 1;
  const gateIndex = flightIndex % GATE_COUNT;
  const gateNumber = gateIndex + 1;

  return `${GATE_PREFIX}${gateNumber}`;
}

function deriveDeparture(id: number, date: string): AirportDeparture {
  const flightIndex = id - 1;
  const slotIndex = flightIndex % DEPARTURE_SLOT_COUNT;
  const minutesFromFirstDeparture = slotIndex * DEPARTURE_INTERVAL_MINUTES;
  const departureMinutes = FIRST_DEPARTURE_MINUTES + minutesFromFirstDeparture;

  return {
    date,
    minutesAfterMidnight: departureMinutes,
  };
}

function mapPostToFlight(post: FlightPost, sessionAirportDate: string): Flight {
  return {
    flightNumber: `${FLIGHT_NUMBER_PREFIX}${post.id}`,
    destination: post.title,
    status: deriveFlightStatus(post.id),
    gate: deriveGate(post.id),
    terminal: post.userId,
    departure: deriveDeparture(post.id, sessionAirportDate),
  };
}

export function mapFlightResponse(
  response: unknown,
  sessionAirportDate: string,
): Flight[] {
  const posts = validateFlightPosts(response);

  return posts.map((post) => mapPostToFlight(post, sessionAirportDate));
}
