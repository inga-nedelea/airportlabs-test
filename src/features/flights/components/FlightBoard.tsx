import { useRef } from 'react';
import {
  ALL_FLIGHT_STATUSES,
  FLIGHT_STATUS_OPTIONS,
  FLIGHT_STATUSES,
} from '../constants/flight';
import type { TerminalFlightGroup } from '../types/flight';
import type { FlightBoardProps } from '../types/presentation';
import { formatDepartureTime } from '../utils/formatFlightTime';
import styles from './FlightBoard.module.css';

const statusStyles = {
  [FLIGHT_STATUSES.ON_TIME]: styles.onTime,
  [FLIGHT_STATUSES.DELAYED]: styles.delayed,
  [FLIGHT_STATUSES.CANCELLED]: styles.cancelled,
};

function TerminalFlights({ terminal, flights }: TerminalFlightGroup) {
  return (
    <section>
      <h3 className={styles.terminalHeading}>Terminal {terminal}</h3>
      <table className={styles.table}>
        <caption className={styles.srOnly}>
          Terminal {terminal} departures
        </caption>
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
  terminalGroups,
  statusValue,
  changeStatus,
}: FlightBoardProps) {
  const statusSelect = useRef<HTMLSelectElement>(null);

  function showAllFlights() {
    changeStatus(ALL_FLIGHT_STATUSES);
    statusSelect.current?.focus();
  }

  return (
    <section aria-label="Departing flights" className={styles.board}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Flight schedule
          {scheduleDate && (
            <>
              {' · '}
              <time dateTime={scheduleDate}>{scheduleDate}</time>
            </>
          )}
        </h2>
        <label className={styles.statusFilter}>
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
      </div>
      {!scheduleDate && (
        <p className={styles.empty} role="status">
          No flights available.
        </p>
      )}
      {scheduleDate && terminalGroups.length === 0 && (
        <div className={styles.empty}>
          <p role="status">No flights match this status.</p>
          <button type="button" onClick={showAllFlights}>
            Show all flights
          </button>
        </div>
      )}
      {terminalGroups.map((group) => (
        <TerminalFlights key={group.terminal} {...group} />
      ))}
    </section>
  );
}
