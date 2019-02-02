export class Stopwatch {
  readonly originalStartTime: number;
  currentLapBeginning: number;
  pauseTime: number | null = null;

  static startNew(startTime?: number): Stopwatch {
    startTime = startTime || Date.now();
    return new Stopwatch(Date.now());
  }

  constructor(public startTime: number, public laps: number[] = []) {
    this.currentLapBeginning = startTime;
    this.originalStartTime = startTime;
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
