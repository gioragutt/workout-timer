import { TestBed } from '@angular/core/testing';

import { WorkoutsDatabaseService } from './workouts-database.service';

describe('WorkoutsDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkoutsDatabaseService = TestBed.get(WorkoutsDatabaseService);
    expect(service).toBeTruthy();
  });
});
