import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router';
import { expect, it, vi } from 'vitest';
import { FLIGHT_STATUSES } from '../constants/flight';
import { useFlightBoard } from '../hooks/useFlightBoard';
import type { Flight } from '../types/flight';
import { FlightBoard } from './FlightBoard';

const firstFlight: Flight = {
  flightNumber: 'FL-1',
  destination: 'London',
  status: FLIGHT_STATUSES.ON_TIME,
  gate: 'G-1',
  terminal: 1,
  departure: { date: '2026-11-03', minutesAfterMidnight: 360 },
};

const flights = [
  firstFlight,
  {
    ...firstFlight,
    flightNumber: 'FL-2',
    destination: 'Paris',
    status: FLIGHT_STATUSES.DELAYED,
    gate: 'G-2',
    terminal: 2,
  },
];

function TestBoard() {
  const board = useFlightBoard(flights);

  return <FlightBoard {...board} />;
}

it('searches by flight number or destination and links to matching groups', () => {
  render(
    <MemoryRouter>
      <TestBoard />
    </MemoryRouter>,
  );

  const search = screen.getByRole('searchbox', { name: 'Search flights' });
  const groupBy = screen.getByRole('combobox', { name: 'Group by' });

  expect(groupBy).toHaveValue('terminal');
  expect(screen.getByRole('link', { name: 'Terminal 1' })).toHaveAttribute(
    'href',
    '#terminal-1',
  );
  expect(screen.getByRole('status')).toHaveTextContent('2 flights found');
  expect(screen.getByText('1 On Time')).toBeVisible();
  expect(screen.getByText('1 Delayed')).toBeVisible();
  expect(screen.getByText('0 Cancelled')).toBeVisible();
  fireEvent.change(search, { target: { value: ' fl-1 ' } });

  expect(screen.queryByRole('link', { name: 'Terminal 2' })).toBeNull();
  expect(screen.getByRole('status')).toHaveTextContent('1 flight found');
  expect(screen.getByText('0 Delayed')).toBeVisible();

  fireEvent.change(groupBy, { target: { value: 'gate' } });

  const firstGate = screen.getByRole('heading', { name: 'Gate G-1' });

  expect(firstGate).toHaveAttribute('tabindex', '-1');
  expect(screen.getByRole('link', { name: 'Gate G-1' })).toHaveAttribute(
    'href',
    `#${firstGate.id}`,
  );
  expect(screen.queryByRole('link', { name: 'Gate G-2' })).toBeNull();
  expect(screen.getByText('1 On Time')).toBeVisible();

  fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), {
    target: { value: 'delayed' },
  });

  expect(screen.getByRole('status')).toHaveTextContent('0 flights found');
  expect(screen.getByText('0 Delayed')).toBeVisible();
  expect(screen.queryByText('0 On Time')).toBeNull();
  expect(screen.queryByText('0 Cancelled')).toBeNull();

  fireEvent.change(search, { target: { value: 'PAR' } });

  expect(screen.getByRole('heading', { name: 'Gate G-2' })).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('1 flight found');
  expect(screen.getByText('1 Delayed')).toBeVisible();
});

it('shows Back to top after passing Jump to and restores heading focus', () => {
  render(
    <MemoryRouter>
      <TestBoard />
    </MemoryRouter>,
  );

  const nav = screen.getByRole('navigation', { name: 'Jump to flight group' });
  const navBounds = vi.spyOn(nav, 'getBoundingClientRect');
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

  navBounds.mockReturnValue(new DOMRect(0, 1000, 300, 48));
  fireEvent.scroll(window);

  expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull();

  navBounds.mockReturnValue(new DOMRect(0, -96, 300, 48));
  fireEvent.scroll(window);
  fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));

  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  expect(
    screen.getByRole('heading', { name: /Flight schedule/ }),
  ).toHaveFocus();

  fireEvent.change(screen.getByRole('searchbox', { name: 'Search flights' }), {
    target: { value: 'no match' },
  });

  expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull();
  scrollTo.mockRestore();
});

it('hydrates board controls from the URL and replaces search edits in history', async () => {
  const router = createMemoryRouter([{ path: '/', element: <TestBoard /> }], {
    initialEntries: ['/?status=delayed&q=par&groupBy=gate&demo=keep'],
  });

  render(<RouterProvider router={router} />);

  const search = screen.getByRole('searchbox', { name: 'Search flights' });
  const groupBy = screen.getByRole('combobox', { name: 'Group by' });

  expect(search).toHaveValue('par');
  expect(groupBy).toHaveValue('gate');
  expect(screen.getByRole('heading', { name: 'Gate G-2' })).toBeVisible();

  fireEvent.change(groupBy, { target: { value: 'terminal' } });
  fireEvent.change(search, { target: { value: ' Paris ' } });

  const params = new URLSearchParams(router.state.location.search);

  expect(params.get('q')).toBe(' Paris ');
  expect(params.get('status')).toBe('delayed');
  expect(params.get('demo')).toBe('keep');
  expect(params.has('groupBy')).toBe(false);
  expect(search).toHaveValue(' Paris ');

  fireEvent.change(search, { target: { value: '' } });

  expect(new URLSearchParams(router.state.location.search).has('q')).toBe(
    false,
  );

  await act(() => router.navigate(-1));

  expect(groupBy).toHaveValue('gate');
  expect(search).toHaveValue('par');
});
