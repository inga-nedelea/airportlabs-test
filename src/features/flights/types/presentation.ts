import type { TerminalFlightGroup } from './flight';
import type { FlightsState } from './requests';

export type FlightBoardProps = {
  scheduleDate: string | undefined;
  terminalGroups: TerminalFlightGroup[];
  statusValue: string;
  changeStatus: (value: string) => void;
};

export type FlightRequestFeedbackProps = Pick<
  FlightsState,
  'isLoading' | 'error' | 'lastSuccessAt'
> & {
  refresh: () => void;
};
