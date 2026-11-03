import type { Flight, TerminalFlightGroup } from '../types/flight';

const compareFlightNumbers = new Intl.Collator('en', { numeric: true }).compare;

function groupFlightsBy<Key>(
  flights: Flight[],
  selectKey: (flight: Flight) => Key,
): Map<Key, Flight[]> {
  const groups = new Map<Key, Flight[]>();

  for (const flight of flights) {
    const key = selectKey(flight);
    const group = groups.get(key);

    if (group) {
      group.push(flight);
    } else {
      groups.set(key, [flight]);
    }
  }

  return groups;
}

function compareDepartures(first: Flight, second: Flight): number {
  const timeDifference =
    first.departure.minutesAfterMidnight -
    second.departure.minutesAfterMidnight;

  return (
    timeDifference ||
    compareFlightNumbers(first.flightNumber, second.flightNumber)
  );
}

export function groupFlightsByTerminal(
  flights: Flight[],
): TerminalFlightGroup[] {
  const groups = groupFlightsBy(flights, (flight) => flight.terminal);

  return [...groups]
    .sort(([first], [second]) => first - second)
    .map(([terminal, group]) => ({
      terminal,
      flights: group.sort(compareDepartures),
    }));
}
