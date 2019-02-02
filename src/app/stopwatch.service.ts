import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stopwatch } from './models/Stopwatch';
import { TimerState } from './models/TimerState';
import { StopwatchState } from './models/StopwatchState';
import { Lap } from './models/Lap';
import { WorkoutsDatabaseService } from './workouts-database.service';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  timerState = TimerState.Stopped;
  stopwatch: Stopwatch = null;

  constructor(private database: WorkoutsDatabaseService) { }

  public stopwatchState$(): Observable<StopwatchState | null> {
    return interval(10).pipe(
      map(() => this.currentStopwatchState())
    );
  }

  get hasRecord(): boolean {
    return this.stopwatch !== null;
  }

  start(): void {
    if (this.timerState === TimerState.Running) {
      return;
    }

    this.timerState = TimerState.Running;
    this.stopwatch = Stopwatch.startNew();
  }

  startNewLap(): void {
    if (this.timerState === TimerState.Running) {
      this.stopwatch.startNewLap(Date.now());
    }
  }

  stop(): void {
    this.timerState = TimerState.Stopped;
    this.stopwatch.pause(Date.now());
    this.database.save(this.stopwatch);
  }

  pause(): void {
    this.timerState = TimerState.Paused;
    this.stopwatch.pause(Date.now());
  }

  resume(): void {
    this.timerState = TimerState.Running;
    this.stopwatch.resume(Date.now());
  }

  private elapsedDuration(): number {
    if (!this.hasRecord) {
      return 0;
    }
    return this.stopwatch.elapsedTime(Date.now());
  }

  private currentLapDuration(): number {
    if (!this.hasRecord) {
      return 0;
    }
    return this.stopwatch.currentLapTime(Date.now());
  }

  private minAndMaxDuration(lapDurations: number[]) {
    const max = lapDurations.length > 1 ? Math.max(...lapDurations) : -1;
    const min = lapDurations.length > 1 ? Math.min(...lapDurations) : -1;
    return { max, min };
  }

  private currentStopwatchState(): StopwatchState {
    if (!this.hasRecord) {
      return null;
    }
    const lapDurations = [...this.stopwatch.laps, this.currentLapDuration()].reverse();
    const { max, min } = this.minAndMaxDuration(this.stopwatch.laps);
    const laps: Lap[] = lapDurations.map(duration => ({
      duration,
      isLongest: duration === max,
      isShortest: duration === min,
    }));
    return { elapsedDuration: this.elapsedDuration(), laps };
  }
}
