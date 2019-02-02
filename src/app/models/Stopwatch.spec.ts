import { Stopwatch } from './Stopwatch';

describe('Stopwatch', () => {
  let workout: Stopwatch;
  let startTime: number;

  beforeEach(() => {
    startTime = Date.now();
    workout = new Stopwatch(startTime);
  });

  describe('Creation', () => {
    it('should be created with given `startTime` and no laps', () => {
      expect(workout.startTime).toBe(startTime);
      expect(workout.laps).not.toBeFalsy();
      expect(workout.laps.length).toBe(0);
    });
  });

  describe('Starting New Lap', () => {
    it('should add a lap given valid time', () => {
      const LAP_DURATION = 5;
      workout.startNewLap(startTime + LAP_DURATION);
      expect(workout.laps.length).toBe(1);
      expect(workout.laps[0]).toBe(5);
    });

    it('should add multiple laps given valid time', () => {
      const FIRST_LAP_DURATION = 5;
      const SECOND_LAP_DURATION = 7;
      workout.startNewLap(startTime + FIRST_LAP_DURATION);
      workout.startNewLap(startTime + FIRST_LAP_DURATION + SECOND_LAP_DURATION);
      expect(workout.laps.length).toBe(2);
      expect(workout.laps[1]).toBe(SECOND_LAP_DURATION);
    });

    it('should not add a lap given invalid first lap time', () => {
      expect(() => workout.startNewLap(startTime - 1)).toThrow();
    });

    it('should not add a lap given invalid non-first lap time', () => {
      workout.startNewLap(startTime + 5);
      expect(() => workout.startNewLap(startTime + 2)).toThrow();
    });
  });

  describe('Elapsed Time and Current Lap Time', () => {
    it('should return elapsedTime', () => {
      const TIME_SINCE_START = 5;
      workout.elapsedTime(startTime + TIME_SINCE_START);
      expect(workout.elapsedTime(startTime + TIME_SINCE_START)).toBe(TIME_SINCE_START);
    });

    it('should return elapsedTime after laps', () => {
      const LAP_DURATION = 5;
      const TOTAL_LAPS = 4;
      for (let i = 1; i <= TOTAL_LAPS; i++) {
        workout.startNewLap(startTime + LAP_DURATION * i);
      }

      const EXPECTED_DURATION = TOTAL_LAPS * LAP_DURATION;
      expect(workout.elapsedTime(startTime + EXPECTED_DURATION)).toBe(EXPECTED_DURATION);
    });

    it('should return elapsed time on currentLapTime before laps are recorded', () => {
      const ELAPSED_TIME = 5;
      expect(workout.currentLapTime(startTime + ELAPSED_TIME)).toBe(ELAPSED_TIME);
    });

    it('should return only the time of the current lap after laps are recorded', () => {
      const ELAPSED_TIME = 12;
      const LAP_DURATION = 5;
      workout.startNewLap(startTime + LAP_DURATION);
      expect(workout.currentLapTime(startTime + ELAPSED_TIME)).toBe(ELAPSED_TIME - LAP_DURATION);
    });
  });

  describe('Pausing', () => {
    it('should not add laps after pausing', () => {
      const ELAPSED_TIME_UNTIL_PAUSE = 5;
      workout.pause(startTime + ELAPSED_TIME_UNTIL_PAUSE);
      workout.startNewLap(0);
      workout.startNewLap(Number.POSITIVE_INFINITY);
      expect(workout.laps.length).toBe(0);
    });

    it('should return elapsedTime based on pauseTime regardless of provided time', () => {
      const ELAPSED_TIME_UNTIL_PAUSE = 5;
      workout.pause(startTime + ELAPSED_TIME_UNTIL_PAUSE);
      expect(workout.elapsedTime(0)).toBe(ELAPSED_TIME_UNTIL_PAUSE);
      expect(workout.elapsedTime(Number.POSITIVE_INFINITY)).toBe(ELAPSED_TIME_UNTIL_PAUSE);
    });

    it('should return currentLapTime based on pauseTime regardless of provided time', () => {
      const ELAPSED_TIME_UNTIL_PAUSE = 20;
      const LAP_DURATION = 5;
      workout.startNewLap(startTime + LAP_DURATION);
      workout.pause(startTime + ELAPSED_TIME_UNTIL_PAUSE);
      const EXPECTED_DURATION = ELAPSED_TIME_UNTIL_PAUSE - LAP_DURATION;
      expect(workout.currentLapTime(0)).toBe(EXPECTED_DURATION);
      expect(workout.currentLapTime(Number.POSITIVE_INFINITY)).toBe(EXPECTED_DURATION);
    });
  });

  describe('Resuming', () => {

  });
});
