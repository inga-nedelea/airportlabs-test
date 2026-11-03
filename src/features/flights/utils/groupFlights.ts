import type {
  Flight,
  FlightGroup,
  FlightGroupingOption,
} from '../types/flight';

const compareIdentifiers = new Intl.Collator('en', { numeric: true }).compare;

export function groupFlightsBy(
  flights: Flight[],
  selectKey: (flight: Flight) => string,
  grouping: FlightGroupingOption,
): FlightGroup[] {
  const groups = new Map<string, Flight[]>();

  for (const flight of flights) {
    const key = selectKey(flight);
    const group = groups.get(key);

    if (group) {
      group.push(flight);
    } else {
      groups.set(key, [flight]);
    }
  }

  return [...groups]
    .sort(([first], [second]) => compareIdentifiers(first, second))
    .map(([key, group]) => ({
      id: `${grouping.value}-${key}`,
      label: `${grouping.label} ${key}`,
      flights: group.sort(compareDepartures),
    }));
}

function compareDepartures(first: Flight, second: Flight): number {
  const timeDifference =
    first.departure.minutesAfterMidnight -
    second.departure.minutesAfterMidnight;

  return (
    timeDifference ||
    compareIdentifiers(first.flightNumber, second.flightNumber)
  );
}
