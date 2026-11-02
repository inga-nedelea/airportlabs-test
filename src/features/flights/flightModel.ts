export const AIRPORT_TIME_ZONE = 'Europe/Chisinau';

export type FlightStatus = 'On Time' | 'Delayed' | 'Cancelled';

type FlightPost = {
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

export function createSessionAirportDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: AIRPORT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  function part(type: Intl.DateTimeFormatPartTypes): string {
    const value = parts.find((entry) => entry.type === type)?.value;
    if (!value) throw new Error('Unable to determine airport date.');
    return value;
  }

  return `${part('year')}-${part('month')}-${part('day')}`;
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function validatePost(value: unknown): FlightPost {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('id' in value) ||
    !isPositiveSafeInteger(value.id) ||
    !('userId' in value) ||
    !isPositiveSafeInteger(value.userId) ||
    !('title' in value) ||
    typeof value.title !== 'string' ||
    value.title.trim().length === 0
  ) {
    throw new Error(
      'Invalid flight data: expected positive integer IDs and a nonblank title.',
    );
  }

  return { id: value.id, userId: value.userId, title: value.title };
}

export function mapFlightResponse(
  response: unknown,
  sessionAirportDate: string,
): Flight[] {
  if (!Array.isArray(response)) {
    throw new Error('Invalid flight data: expected an array.');
  }

  const seenIds = new Set<number>();
  return response.map((value: unknown) => {
    const post = validatePost(value);
    if (seenIds.has(post.id)) {
      throw new Error(`Invalid flight data: duplicate ID ${post.id}.`);
    }
    seenIds.add(post.id);

    return {
      flightNumber: `FL-${post.id}`,
      destination: post.title,
      status:
        post.id % 10 === 0
          ? 'Cancelled'
          : post.id % 3 === 0
            ? 'Delayed'
            : 'On Time',
      gate: `G-${((post.id - 1) % 20) + 1}`,
      terminal: post.userId,
      departure: {
        date: sessionAirportDate,
        minutesAfterMidnight: 6 * 60 + ((post.id - 1) % 216) * 5,
      },
    };
  });
}
