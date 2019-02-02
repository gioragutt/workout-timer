import { BehaviorSubject } from 'rxjs';

const saveToLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const readFromLocalStorage = <T>(key: string, defaultValue: T) => {
  const existing = localStorage.getItem(key);
  if (!existing) {
    saveToLocalStorage(key, defaultValue);
    return defaultValue;
  }

  try {
    return JSON.parse(existing) as T;
  } catch (e) {
    console.error(e);
    saveToLocalStorage(key, defaultValue);
    return defaultValue;
  }
};

export class LocalStorageBehaviorSubject<T> extends BehaviorSubject<T> {
  constructor(localStorageKey: string, defaultValue: T) {
    super(readFromLocalStorage(localStorageKey, defaultValue));

    this.subscribe((value: T) => {
      saveToLocalStorage(localStorageKey, value);
    });
  }
}
