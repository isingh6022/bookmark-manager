import { _STORE_KEY_TYPE, _STORAGE_DATA_OBJECT } from '@proj-const';

// A cache of the storage data that is synced with the browser storage.
interface SyncedStorage<T> {
  readonly isSynced: boolean;
  readonly initialized: boolean;
  afterInit(fn: () => void): void;

  getCurrentState(): T;
  getSaveDataForSyncAndCommit(): Partial<STORAGE_DATA_OBJECT>;
  loadFromSavedData(data: any): void;
}

type STORE_KEY_TYPE = _STORE_KEY_TYPE;
type STORAGE_DATA_OBJECT<T = any> = _STORAGE_DATA_OBJECT<T>;

export interface StorageUnit<T> {
  readonly key: STORE_KEY_TYPE;
  readonly val: T;
  updateAndSave(obj: T): void;
}

interface Storage {
  loadData(fn: (data: STORAGE_DATA_OBJECT) => void): void;
  setData(data: Partial<STORAGE_DATA_OBJECT>): void;
}

interface StorageDAO<T> {
  load(): Promise<T>;
  save(data: T): void;
}

export type { SyncedStorage, STORE_KEY_TYPE, STORAGE_DATA_OBJECT, Storage, StorageDAO };
