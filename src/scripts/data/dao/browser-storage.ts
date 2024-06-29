import {
  ALL_STORE_KEYS,
  DEFAULT_BKM_PG_FOL_COL_COUNT,
  CONSECUTIVE_STORAGE_UPDATE_DELAY
} from '@proj-const';
import { Flow, STORAGE_DATA_OBJECT, Storage } from '@proj-types';
import { BROWSER } from '../browser/browser-api.js';
import { FailedToLoadStorageData, BaseSingleton } from '../../utilities/utilities.js';

const DEFAULT_STORAGE_VALS: STORAGE_DATA_OBJECT = {
  icons: {},
  pins: [],
  homePin: '',
  groupBkmFol: false,
  showFolBkmIcons: false,
  flowDirection: Flow.COL,
  notice: '',
  colCount: DEFAULT_BKM_PG_FOL_COL_COUNT,
  themes: [],
  currTheme: ''
};

export class BrowserStorage extends BaseSingleton implements Storage {
  static get instance(): BrowserStorage {
    return BaseSingleton._getInstance(BrowserStorage) || new BrowserStorage();
  }

  private _onLoad: ((data: STORAGE_DATA_OBJECT) => void)[] = [];
  loadData(fn: (data: STORAGE_DATA_OBJECT) => void): void {
    this._onLoad.push(fn);
    !this._loading && this._loadData();
  }

  private _loading = false;
  private async _loadData(): Promise<void> {
    let currData: STORAGE_DATA_OBJECT, data: STORAGE_DATA_OBJECT;

    this._loading = true;
    data = <any>await BROWSER.actions.getLocalStorage(ALL_STORE_KEYS).catch(() => {
      throw new FailedToLoadStorageData(BrowserStorage.name);
    });
    this._loading = false;

    // Event if there are any pending updates, currData is the latest.
    // And its assumed that any update calls to stroage will always succeed.
    currData = { ...DEFAULT_STORAGE_VALS };

    for (let key of ALL_STORE_KEYS) {
      let keyStr = <keyof STORAGE_DATA_OBJECT>key;
      if (data[keyStr] !== undefined) {
        currData[keyStr] = data[keyStr];
      }
      if (this._outOfSyncData[keyStr] !== undefined) {
        currData[keyStr] = this._outOfSyncData[keyStr];
      }
    }

    this._syncData();

    this._onLoad.forEach((fn) => fn(currData));
    this._onLoad = [];
  }

  private _outOfSyncData: Partial<STORAGE_DATA_OBJECT> = {};
  setData(data: Partial<STORAGE_DATA_OBJECT<any>>): void {
    this._outOfSyncData = { ...this._outOfSyncData, ...data };
    this._synced = false;

    this._syncData();
  }

  private _synced = true;
  private _synching = false;
  private _syncData(): void {
    if (this._loading || this._synching || this._synced) return;

    this._synching = true;
    let _outOfSyncData = this._outOfSyncData;
    this._outOfSyncData = {};

    // Assume that following always works...
    BROWSER.actions.store(_outOfSyncData).then(() => {
      setTimeout(() => {
        this._synching = false;
        !this._synced && this._syncData();
      }, CONSECUTIVE_STORAGE_UPDATE_DELAY);
    });

    this._synced = true;
  }
}
