import type { Flight } from './flight';
import type { FlightsState } from './requests';

export type FlightBoardProps = {
  flights: Flight[];
};

export type FlightRequestFeedbackProps = Pick<
  FlightsState,
  'isLoading' | 'error' | 'lastSuccessAt'
> & {
  refresh: () => void;
};
