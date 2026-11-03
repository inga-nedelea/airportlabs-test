import type { FlightGroup, FlightGroupingOption, FlightStatus } from './flight';
import type { FlightsState } from './requests';

export type FlightBoardProps = {
  scheduleDate: string | undefined;
  groups: FlightGroup[];
  groupBy: FlightGroupingOption['value'];
  changeGrouping: (value: string) => void;
  resultCount: number;
  statusCounts: Record<FlightStatus, number>;
  searchValue: string;
  changeSearch: (value: string) => void;
  statusValue: string;
  changeStatus: (value: string) => void;
};

export type FlightRequestFeedbackProps = Pick<
  FlightsState,
  'isLoading' | 'error' | 'lastSuccessAt'
> & {
  refresh: () => void;
};

export type FlightDemoControlsProps = {
  isFailureArmed: boolean;
  armFailure: () => void;
};
