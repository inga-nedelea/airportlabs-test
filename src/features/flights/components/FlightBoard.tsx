import { FLIGHT_STATUSES } from '../constants/flight';
import type { FlightBoardProps } from '../types/presentation';
import { formatDepartureTime } from '../utils/formatFlightTime';
import styles from './FlightBoard.module.css';

const statusStyles = {
  [FLIGHT_STATUSES.ON_TIME]: styles.onTime,
  [FLIGHT_STATUSES.DELAYED]: styles.delayed,
  [FLIGHT_STATUSES.CANCELLED]: styles.cancelled,
};

export function FlightBoard({ flights }: FlightBoardProps) {
  const [firstFlight] = flights;

  if (!firstFlight) {
    return <p className={styles.empty}>No flights available.</p>;
  }

  return (
    <section aria-label="Departing flights" className={styles.board}>
      <h2 className={styles.heading}>
        Flight schedule ·{' '}
        <time dateTime={firstFlight.departure.date}>
          {firstFlight.departure.date}
        </time>
      </h2>
      <table className={styles.table}>
        <caption className={styles.srOnly}>Departing flights</caption>
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
              <h3>{flight.flightNumber}</h3>
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
