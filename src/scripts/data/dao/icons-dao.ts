import { IconSaveData, StorageDAO } from '@proj-types';
import { BrowserStorage } from './browser-storage.js';
import { STORE_KEYS } from '@proj-const';
import { BaseSingleton } from '../../utilities/utilities.js';

export class IconsDao extends BaseSingleton implements StorageDAO<IconSaveData> {
  static get instance(): IconsDao {
    return BaseSingleton._getInstance(IconsDao) || new IconsDao();
  }

  load(): Promise<IconSaveData> {
    return new Promise((resolve) => {
      STORE_KEYS.icons;
      BrowserStorage.instance.loadData((data) => resolve(data[STORE_KEYS.icons]));
    });
  }
  save(data: IconSaveData): void {
    BrowserStorage.instance.setData({ [STORE_KEYS.icons]: data });
  }
}
