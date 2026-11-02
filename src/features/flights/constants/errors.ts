export const FLIGHT_DATA_ERROR_CODES = {
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  INVALID_POST: 'INVALID_POST',
  DUPLICATE_ID: 'DUPLICATE_ID',
  AIRPORT_DATE: 'AIRPORT_DATE',
} as const;

export const FLIGHT_DATA_ERROR_MESSAGES = {
  [FLIGHT_DATA_ERROR_CODES.INVALID_RESPONSE]:
    'Invalid flight data: expected an array.',
  [FLIGHT_DATA_ERROR_CODES.INVALID_POST]:
    'Invalid flight data: expected a post object.',
  [FLIGHT_DATA_ERROR_CODES.DUPLICATE_ID]: 'Invalid flight data: duplicate ID.',
  [FLIGHT_DATA_ERROR_CODES.AIRPORT_DATE]: 'Unable to determine airport date.',
} as const;

export const FLIGHT_POST_FIELD_ERROR_MESSAGES = {
  id: 'Invalid flight data: id must be a positive safe integer.',
  userId: 'Invalid flight data: userId must be a positive safe integer.',
  title: 'Invalid flight data: title must be a nonblank string.',
} as const;
