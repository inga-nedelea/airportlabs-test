import type { FlightPost } from '../types/flight';
import { FLIGHT_DATA_ERROR_CODES } from '../constants/errors';
import { FlightDataError } from '../errors/FlightDataError';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validatePost(value: unknown): FlightPost {
  if (!isRecord(value)) {
    throw new FlightDataError(FLIGHT_DATA_ERROR_CODES.INVALID_POST);
  }

  if (!isPositiveSafeInteger(value.id)) {
    throw new FlightDataError(FLIGHT_DATA_ERROR_CODES.INVALID_POST, {
      field: 'id',
    });
  }

  if (!isPositiveSafeInteger(value.userId)) {
    throw new FlightDataError(FLIGHT_DATA_ERROR_CODES.INVALID_POST, {
      field: 'userId',
    });
  }

  if (!isNonBlankString(value.title)) {
    throw new FlightDataError(FLIGHT_DATA_ERROR_CODES.INVALID_POST, {
      field: 'title',
    });
  }

  return { id: value.id, userId: value.userId, title: value.title };
}

function ensureUniqueId(id: number, seenIds: Set<number>): void {
  if (seenIds.has(id)) {
    throw new FlightDataError(FLIGHT_DATA_ERROR_CODES.DUPLICATE_ID, {
      duplicateId: id,
    });
  }

  seenIds.add(id);
}

export function validateFlightPosts(response: unknown): FlightPost[] {
  if (!Array.isArray(response)) {
    throw new FlightDataError(FLIGHT_DATA_ERROR_CODES.INVALID_RESPONSE);
  }

  const seenIds = new Set<number>();
  const posts: FlightPost[] = [];

  for (const value of response) {
    const post = validatePost(value);

    ensureUniqueId(post.id, seenIds);

    posts.push(post);
  }

  return posts;
}
