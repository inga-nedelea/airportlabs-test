import { useEffect, useRef, useState } from 'react';
import {
  ALL_FLIGHT_STATUSES,
  FLIGHT_GROUPING_OPTIONS,
  FLIGHT_STATUS_OPTIONS,
  FLIGHT_STATUSES,
} from '../constants/flight';
import type { FlightGroup } from '../types/flight';
import type { FlightBoardProps } from '../types/presentation';
import { formatDepartureTime } from '../utils/formatFlightTime';
import styles from './FlightBoard.module.css';

const statusStyles = {
  [FLIGHT_STATUSES.ON_TIME]: styles.onTime,
  [FLIGHT_STATUSES.DELAYED]: styles.delayed,
  [FLIGHT_STATUSES.CANCELLED]: styles.cancelled,
};

function FlightGroupSection({ id, label, flights }: FlightGroup) {
  return (
    <section>
      <h3 className={styles.groupHeading} id={id} tabIndex={-1}>
        {label}
      </h3>
      <table className={styles.table}>
        <caption className={styles.srOnly}>{label} departures</caption>
        <thead>
          <tr>
            <th scope="col">Departure</th>
            <th scope="col">Flight</th>
            <th scope="col">Destination</th>
            <th scope="col">Status</th>
            <th scope="col">Gate</th>
            <th scope="col">Terminal</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.flightNumber}>
              <td className={styles.clock}>
                <time
                  dateTime={`${flight.departure.date}T${formatDepartureTime(flight.departure.minutesAfterMidnight)}`}
                >
                  {formatDepartureTime(flight.departure.minutesAfterMidnight)}
                </time>
              </td>
              <th scope="row" className={styles.flightNumber}>
                {flight.flightNumber}
              </th>
              <td className={styles.destination}>{flight.destination}</td>
              <td>
                <span
                  className={`${styles.status} ${statusStyles[flight.status]}`}
                >
                  {flight.status}
                </span>
              </td>
              <td className={styles.identifier}>{flight.gate}</td>
              <td className={styles.identifier}>{flight.terminal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className={styles.cards}>
        {flights.map((flight) => (
          <li key={flight.flightNumber} className={styles.card}>
            <div className={styles.cardHeader}>
              <h4>{flight.flightNumber}</h4>
              <span
                className={`${styles.status} ${statusStyles[flight.status]}`}
              >
                {flight.status}
              </span>
            </div>
            <p className={styles.cardDestination}>{flight.destination}</p>
            <dl className={styles.details}>
              <div>
                <dt>Departure</dt>
                <dd className={styles.clock}>
                  <time
                    dateTime={`${flight.departure.date}T${formatDepartureTime(flight.departure.minutesAfterMidnight)}`}
                  >
                    {formatDepartureTime(flight.departure.minutesAfterMidnight)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Gate</dt>
                <dd>{flight.gate}</dd>
              </div>
              <div>
                <dt>Terminal</dt>
                <dd>{flight.terminal}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FlightBoard({
  scheduleDate,
  groups,
  groupBy,
  changeGrouping,
  resultCount,
  statusCounts,
  searchValue,
  changeSearch,
  statusValue,
  changeStatus,
}: FlightBoardProps) {
  const searchInput = useRef<HTMLInputElement>(null);
  const statusSelect = useRef<HTMLSelectElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const jumpLinks = useRef<HTMLElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const hasSearch = searchValue.trim().length > 0;
  const visibleStatuses = FLIGHT_STATUS_OPTIONS.filter(
    ({ value }) => statusValue === ALL_FLIGHT_STATUSES || value === statusValue,
  );

  useEffect(() => {
    const nav = jumpLinks.current;
    const controls = toolbar.current;

    if (!nav || !controls) {
      return;
    }

    const updateBackToTop = () => {
      const visibleTop = Math.max(0, controls.getBoundingClientRect().bottom);

      setShowBackToTop(nav.getBoundingClientRect().bottom < visibleTop);
    };

    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('resize', updateBackToTop);

    return () => {
      window.removeEventListener('scroll', updateBackToTop);
      window.removeEventListener('resize', updateBackToTop);
    };
  }, [groups]);

  function backToTop() {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function clearSearch() {
    changeSearch('');
    searchInput.current?.focus();
  }

  function showAllFlights() {
    changeStatus(ALL_FLIGHT_STATUSES);
    statusSelect.current?.focus();
  }

  return (
    <section aria-label="Departing flights" className={styles.board}>
      <h2 className={styles.heading} ref={heading} tabIndex={-1}>
        Flight schedule
        {scheduleDate && (
          <>
            {' · '}
            <time dateTime={scheduleDate}>{scheduleDate}</time>
          </>
        )}
      </h2>
      <div className={styles.toolbar} ref={toolbar}>
        <div className={styles.filters}>
          <label className={styles.filter}>
            Search flights
            <input
              ref={searchInput}
              type="search"
              placeholder="Flight number or destination"
              value={searchValue}
              onChange={(event) => changeSearch(event.currentTarget.value)}
            />
          </label>
          <label className={styles.filter}>
            Status
            <select
              ref={statusSelect}
              value={statusValue}
              onChange={(event) => changeStatus(event.currentTarget.value)}
            >
              <option value={ALL_FLIGHT_STATUSES}>All statuses</option>
              {FLIGHT_STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.filter}>
            Group by
            <select
              value={groupBy}
              onChange={(event) => changeGrouping(event.currentTarget.value)}
            >
              {FLIGHT_GROUPING_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.resultSummary}>
          <p className={styles.srOnly} role="status">
            {resultCount} {resultCount === 1 ? 'flight' : 'flights'} found
          </p>
          {visibleStatuses.map(({ label }) => (
            <span
              key={label}
              className={`${styles.status} ${statusStyles[label]}`}
            >
              {statusCounts[label]} {label}
            </span>
          ))}
        </div>
      </div>
      {groups.length > 0 && (
        <nav
          aria-label="Jump to flight group"
          className={styles.jumpLinks}
          ref={jumpLinks}
        >
          <span>Jump to</span>
          {groups.map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      )}
      {!scheduleDate && (
        <p className={styles.empty} role="status">
          No flights available.
        </p>
      )}
      {scheduleDate && groups.length === 0 && (
        <div className={styles.empty}>
          <p>
            {hasSearch
              ? 'No flights match your search.'
              : 'No flights match this status.'}
          </p>
          {hasSearch ? (
            <button type="button" onClick={clearSearch}>
              Clear search
            </button>
          ) : (
            <button type="button" onClick={showAllFlights}>
              Show all flights
            </button>
          )}
        </div>
      )}
      {groups.map((group) => (
        <FlightGroupSection key={group.id} {...group} />
      ))}
      {groups.length > 0 && showBackToTop && (
        <button
          type="button"
          className={styles.backToTop}
          aria-label="Back to top"
          onClick={backToTop}
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}
    </section>
  );
}
