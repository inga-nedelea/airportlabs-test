import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import {
  ALL_FLIGHT_STATUSES,
  FLIGHT_GROUPING_OPTIONS,
  FLIGHT_GROUPING_PARAM,
  FLIGHT_SEARCH_PARAM,
  FLIGHT_STATUS_OPTIONS,
  FLIGHT_STATUS_PARAM,
  FLIGHT_STATUSES,
} from '../constants/flight';
import type { Flight } from '../types/flight';
import { groupFlightsBy } from '../utils/groupFlights';

const defaultGrouping = FLIGHT_GROUPING_OPTIONS[0];

export function useFlightBoard(flights: Flight[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get(FLIGHT_SEARCH_PARAM) ?? '';
  const groupingParam = searchParams.get(FLIGHT_GROUPING_PARAM);
  const grouping =
    FLIGHT_GROUPING_OPTIONS.find(({ value }) => value === groupingParam) ??
    defaultGrouping;
  const query = searchValue.trim().toLowerCase();
  const statusParam = searchParams.get(FLIGHT_STATUS_PARAM);
  const statusOption = FLIGHT_STATUS_OPTIONS.find(
    ({ value }) => value === statusParam,
  );
  const selectedStatus = statusOption?.label;
  const { groups, resultCount, statusCounts } = useMemo(() => {
    const matchingFlights = flights.filter((flight) => {
      const matchesStatus = !selectedStatus || flight.status === selectedStatus;
      const matchesSearch =
        flight.flightNumber.toLowerCase().includes(query) ||
        flight.destination.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
    const statusCounts = {
      [FLIGHT_STATUSES.ON_TIME]: 0,
      [FLIGHT_STATUSES.DELAYED]: 0,
      [FLIGHT_STATUSES.CANCELLED]: 0,
    };

    for (const flight of matchingFlights) {
      statusCounts[flight.status] += 1;
    }

    return {
      groups: groupFlightsBy(
        matchingFlights,
        (flight) => String(flight[grouping.value]),
        grouping,
      ),
      resultCount: matchingFlights.length,
      statusCounts,
    };
  }, [flights, selectedStatus, query, grouping]);

  function changeParam(name: string, value: string, replace = false) {
    const nextParams = new URLSearchParams(searchParams);

    if (value === '') {
      nextParams.delete(name);
    } else {
      nextParams.set(name, value);
    }

    setSearchParams(nextParams, { replace });
  }

  function changeSearch(value: string) {
    changeParam(FLIGHT_SEARCH_PARAM, value, true);
  }

  function changeGrouping(value: string) {
    const option = FLIGHT_GROUPING_OPTIONS.find(
      (option) => option.value === value,
    );

    if (option) {
      changeParam(
        FLIGHT_GROUPING_PARAM,
        option === defaultGrouping ? '' : value,
      );
    }
  }

  function changeStatus(value: string) {
    changeParam(FLIGHT_STATUS_PARAM, value);
  }

  return {
    scheduleDate: flights[0]?.departure.date,
    groups,
    groupBy: grouping.value,
    changeGrouping,
    resultCount,
    statusCounts,
    searchValue,
    changeSearch,
    statusValue: statusOption?.value ?? ALL_FLIGHT_STATUSES,
    changeStatus,
  };
}
