import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum TimerState {
  Stopped = 'stopped',
  Running = 'running',
  Paused = 'paused',
}

export class Stopwatch {
  currentLapBeginning: number;
  pauseTime: number | null = null;

  static startNew(startTime?: number): Stopwatch {
    startTime = startTime || Date.now();
    return new Stopwatch(Date.now());
  }

  constructor(public startTime: number, public laps: number[] = []) {
    this.currentLapBeginning = startTime;
  }

  private get paused(): boolean {
    return this.pauseTime !== null;
  }

  startNewLap(beginningOfNewLap: number): void {
    if (this.paused) {
      return;
    }

    const currentLapDuration = beginningOfNewLap - this.currentLapBeginning;
    if (currentLapDuration < 0) {
      throw new Error(`Lap ${this.laps.length + 1} recorded with invalid time: ${beginningOfNewLap} is before ${this.currentLapBeginning}`);
    }
    this.laps.push(currentLapDuration);
    this.currentLapBeginning = beginningOfNewLap;
  }

  pause(pauseTime: number): void {
    if (this.paused) {
      return;
    }
    this.pauseTime = pauseTime;
  }

  resume(resumeTime: number): void {
    if (!this.paused) {
      return;
    }

    const timeUntilResume = resumeTime - this.pauseTime;
    if (timeUntilResume < 0) {
      throw new Error(`Attempt to resume to time(${resumeTime}) before pause time(${this.pauseTime})`);
    }

    this.pauseTime = null;
    this.startTime += timeUntilResume;
    this.currentLapBeginning += timeUntilResume;
  }

  currentLapTime(nowTime: number) {
    if (this.paused) {
      return this.pauseTime - this.currentLapBeginning;
    }
    return nowTime - this.currentLapBeginning;
  }

  elapsedTime(nowTime: number) {
    if (this.paused) {
      return this.pauseTime - this.startTime;
    }
    return nowTime - this.startTime;
  }
}

interface StopwatchState {
  elapsedDuration: number;
  laps: number[];
}

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  timerState = TimerState.Stopped;
  stopwatch: Stopwatch = null;

  constructor() { }

  public stopwatchState$(): Observable<StopwatchState | null> {
    return interval(10).pipe(
      map(() => {
        if (!this.hasRecord) {
          return null;
        }
        return {
          elapsedDuration: this.elapsedDuration(),
          laps: [...this.stopwatch.laps, this.currentLapDuration()].reverse(),
        };
      })
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
}
