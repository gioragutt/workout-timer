import { Injectable } from '@angular/core';
import { LocalStorageBehaviorSubject } from './LocalStorageBehaviorSubject';
import { Stopwatch } from './models/Stopwatch';

export interface WorkoutsDatabase {
  [key: number]: Stopwatch;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutsDatabaseService {
  database = new LocalStorageBehaviorSubject<WorkoutsDatabase>('workouts', {});

  constructor() { }

  public save(workout: Stopwatch) {
    const database = {
      ...this.database.value,
      [workout.originalStartTime]: workout,
    };
    this.database.next(database);
  }
}
