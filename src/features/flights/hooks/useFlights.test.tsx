import { StrictMode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { FLIGHT_DATA_ERROR_CODES } from '../constants/errors';
import {
  FLIGHTS_REFRESH_INTERVAL_MS,
  FLIGHTS_REQUEST_TIMEOUT_MS,
  FLIGHT_REQUEST_ERROR_CODES,
} from '../constants/requests';
import { useFlights } from './useFlights';

const fetchMock = vi.fn<typeof fetch>();
const posts = [{ id: 1, userId: 2, title: 'Vienna' }];

function queueRequest() {
  let resolve!: (response: Response) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<Response>((resolveResponse, rejectResponse) => {
    resolve = resolveResponse;
    reject = rejectResponse;
  });

  // Deliberately ignore AbortSignal so the hook's request guard is exercised.
  fetchMock.mockImplementationOnce(() => promise);

  return { resolve, reject };
}

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-02T21:59:45Z'));
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it('ignores superseded completions and failures, including Strict Mode cleanup', async () => {
  const strictRequest = queueRequest();
  const initialRequest = queueRequest();
  const { result, unmount } = renderHook(() => useFlights(), {
    wrapper: StrictMode,
  });

  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
  expect(vi.getTimerCount()).toBe(2);

  const latestRequest = queueRequest();

  act(() => result.current.refresh());
  expect(fetchMock.mock.calls[1]?.[1]?.signal?.aborted).toBe(true);

  await act(async () => {
    strictRequest.resolve(jsonResponse(posts));
    initialRequest.reject(new TypeError('Late network failure'));
  });

  expect(result.current).toMatchObject({
    flights: [],
    isLoading: true,
    error: null,
    lastSuccessAt: null,
  });

  await act(async () => latestRequest.resolve(jsonResponse(posts)));

  const successState = result.current;
  const olderRequest = queueRequest();

  act(() => result.current.refresh());

  const newerRequest = queueRequest();

  act(() => result.current.refresh());

  await act(async () => newerRequest.resolve(jsonResponse([])));

  const newerState = result.current;

  expect(newerState.flights).toEqual([]);
  expect(newerState.error).toBeNull();
  expect(successState.flights[0]?.destination).toBe('Vienna');

  await act(async () => olderRequest.resolve(jsonResponse(posts)));

  expect(result.current).toEqual(newerState);

  const unmountedRequest = queueRequest();

  act(() => result.current.refresh());
  unmount();
  expect(fetchMock.mock.calls.at(-1)?.[1]?.signal?.aborted).toBe(true);
  expect(vi.getTimerCount()).toBe(0);

  const callCount = fetchMock.mock.calls.length;

  await act(async () => {
    unmountedRequest.resolve(jsonResponse(posts));
    await vi.advanceTimersByTimeAsync(FLIGHTS_REFRESH_INTERVAL_MS);
  });

  expect(fetchMock).toHaveBeenCalledTimes(callCount);
});

it('retains stale flights and warnings through failures and retries, then recovers', async () => {
  const initialRequest = queueRequest();
  const { result, unmount } = renderHook(() => useFlights());

  await act(async () => initialRequest.resolve(jsonResponse(posts)));

  const successfulFlights = result.current.flights;
  const lastSuccessAt = result.current.lastSuccessAt;

  expect(successfulFlights[0]?.departure.date).toBe('2026-11-02');

  await act(async () => vi.advanceTimersByTimeAsync(5_000));

  const httpRequest = queueRequest();

  act(() => result.current.refresh());

  await act(async () =>
    httpRequest.resolve(new Response(null, { status: 503 })),
  );

  expect(result.current.error).toMatchObject({
    code: FLIGHT_REQUEST_ERROR_CODES.HTTP,
    status: 503,
  });

  const failures = [
    {
      response: new Response('{'),
      code: FLIGHT_REQUEST_ERROR_CODES.DECODE,
    },
    {
      response: jsonResponse([{ id: 1, userId: 2, title: ' ' }]),
      code: FLIGHT_DATA_ERROR_CODES.INVALID_POST,
    },
  ];

  for (const failure of failures) {
    const request = queueRequest();
    const previousError = result.current.error;

    act(() => result.current.refresh());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(previousError);

    await act(async () => request.resolve(failure.response));

    expect(result.current.error).toMatchObject({ code: failure.code });
    expect(result.current.flights).toBe(successfulFlights);
    expect(result.current.lastSuccessAt).toBe(lastSuccessAt);
    expect(result.current.isLoading).toBe(false);
  }

  const networkRequest = queueRequest();

  act(() => result.current.refresh());

  await act(async () => networkRequest.reject(new TypeError('Offline')));

  expect(result.current.error).toMatchObject({
    code: FLIGHT_REQUEST_ERROR_CODES.NETWORK,
  });

  const timedOutRequest = queueRequest();

  act(() => result.current.refresh());

  await act(async () =>
    vi.advanceTimersByTimeAsync(FLIGHTS_REQUEST_TIMEOUT_MS),
  );

  expect(fetchMock.mock.calls.at(-1)?.[1]?.signal?.aborted).toBe(true);
  expect(result.current).toMatchObject({
    flights: successfulFlights,
    lastSuccessAt,
    isLoading: false,
    error: { code: FLIGHT_REQUEST_ERROR_CODES.TIMEOUT },
  });

  await act(async () => timedOutRequest.resolve(jsonResponse([])));

  expect(result.current.error?.code).toBe(FLIGHT_REQUEST_ERROR_CODES.TIMEOUT);
  expect(result.current.flights).toBe(successfulFlights);

  const recoveryRequest = queueRequest();

  // The manual request at five seconds did not move the original 30-second tick.
  await act(async () => vi.advanceTimersByTimeAsync(15_000));

  expect(fetchMock).toHaveBeenCalledTimes(7);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.error?.code).toBe(FLIGHT_REQUEST_ERROR_CODES.TIMEOUT);

  await act(async () => recoveryRequest.resolve(jsonResponse([])));

  expect(result.current).toMatchObject({
    flights: [],
    isLoading: false,
    error: null,
    lastSuccessAt: Date.now(),
  });
  expect(result.current.lastSuccessAt).not.toBe(lastSuccessAt);

  const nextRequest = queueRequest();

  act(() => result.current.refresh());

  await act(async () => nextRequest.resolve(jsonResponse(posts)));

  expect(result.current.flights[0]?.departure.date).toBe('2026-11-02');
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
