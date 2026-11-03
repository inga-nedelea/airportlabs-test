import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import {
  ALL_FLIGHT_STATUSES,
  FLIGHT_STATUS_OPTIONS,
  FLIGHT_STATUS_PARAM,
} from '../constants/flight';
import type { Flight } from '../types/flight';
import { groupFlightsByTerminal } from '../utils/groupFlights';

export function useFlightBoard(flights: Flight[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get(FLIGHT_STATUS_PARAM);
  const statusOption = FLIGHT_STATUS_OPTIONS.find(
    ({ value }) => value === statusParam,
  );
  const selectedStatus = statusOption?.label;
  const terminalGroups = useMemo(() => {
    const matchingFlights = selectedStatus
      ? flights.filter((flight) => flight.status === selectedStatus)
      : flights;

    return groupFlightsByTerminal(matchingFlights);
  }, [flights, selectedStatus]);

  function changeStatus(value: string) {
    const nextParams = new URLSearchParams(searchParams);

    if (value === ALL_FLIGHT_STATUSES) {
      nextParams.delete(FLIGHT_STATUS_PARAM);
    } else {
      nextParams.set(FLIGHT_STATUS_PARAM, value);
    }

    setSearchParams(nextParams);
  }

  return {
    scheduleDate: flights[0]?.departure.date,
    terminalGroups,
    statusValue: statusOption?.value ?? ALL_FLIGHT_STATUSES,
    changeStatus,
  };
}
