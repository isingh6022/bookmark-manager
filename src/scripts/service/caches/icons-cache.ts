import { STORE_KEYS } from '@proj-const';
import { IconObj, IconData, IconSaveData, StorageDAO, ReadonlyIconCache } from '@proj-types';
import { BaseSingleton } from '../../utilities/utilities.js';
import { BaseCache } from './baseCache.js';
import { IconsDao } from '../../data/dao/icons-dao.js';

export class IconsCache extends BaseCache<IconObj> {
  protected override _getDaoInstance(): StorageDAO<any> {
    return IconsDao.instance;
  }
  static get instance(): IconsCache {
    return BaseSingleton._getInstance(IconsCache) || new IconsCache();
  }
  get readonly(): ReadonlyIconCache {
    return this;
  }

  private _saveData: IconSaveData = {};
  private _icons: IconObj = {};
  private _isChanged: boolean = false;

  getIco(id: string): IconData | undefined {
    return this._icons[id];
  }
  getCurrentState(): IconObj {
    return { ...this._icons };
  }

  addIco(id: string, title: string) {
    this._saveData[id] = title;
    this._icons[id] = { title: title, title_lower: title.toLowerCase() };
    this._isChanged = true;
    this._updateStorage();
  }

  rmvIco(id: string): IconData | undefined {
    let data = this.getIco(id);
    if (!data) return;

    delete this._icons[id];
    delete this._saveData[id];
    this._isChanged = true;
    this._updateStorage();

    return data;
  }

  get isSynced(): boolean {
    return !this._isChanged;
  }

  getSaveDataForSyncAndCommit() {
    this._isChanged = false;
    return { [STORE_KEYS.icons]: this._saveData };
  }
  loadFromSavedData(saveData: { icons: IconSaveData }): void {
    // Should be used to populate the data.
    let title: string | undefined;
    this._saveData = saveData.icons || {};

    for (let k in this._saveData) {
      title = this._saveData[k];
      if (title) {
        this._icons[k] = {
          title,
          title_lower: title.toLowerCase()
        };
      }
    }
    this._isChanged = false;
  }
}
