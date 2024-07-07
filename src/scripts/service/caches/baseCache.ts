import { ReadonlyCache, STORAGE_DATA_OBJECT, StorageDAO, SyncedStorage } from '@proj-types';
import { BaseSingleton } from '../../utilities/utilities.js';

export abstract class BaseCache<T> extends BaseSingleton implements SyncedStorage<T> {
  constructor() {
    super();
    this._init();
  }
  abstract get readonly(): ReadonlyCache<T>;
  abstract getCurrentState(): T;
  private _initialized: boolean = false;
  get initialized(): boolean {
    return this._initialized;
  }

  private _onInitializeCallbacks: (() => void)[] = [];
  afterInit(fn: () => void): void {
    this._initialized ? fn() : this._onInitializeCallbacks.push(fn);
  }

  protected abstract _getDaoInstance(): StorageDAO<any>;
  private _init(): void {
    let promise = new Promise<void>((res) => {
      this._getDaoInstance()
        .load()
        .then((state) => {
          this.loadFromSavedData(state);
          res();
        });
    });
    promise.then(() => {
      this._initialized = true;
      this._onInitializeCallbacks.forEach((fn) => fn());
      this._onInitializeCallbacks = [];
    });
  }

  protected _updateStorage() {
    this._getDaoInstance().save(this.getSaveDataForSyncAndCommit());
  }

  abstract get isSynced(): boolean;
  abstract getSaveDataForSyncAndCommit(): Partial<STORAGE_DATA_OBJECT<any>>;
  abstract loadFromSavedData(data: any): void;
}
