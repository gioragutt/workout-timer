import { Lap } from './Lap';

export interface StopwatchState {
  elapsedDuration: number;
  laps: Lap[];
}
