import {
  BKM_DISPLAY_ORDER,
  RetainedState,
  STORAGE_DATA_OBJECT,
  StorageDAO,
  Theme
} from '@proj-types';
import { BrowserStorage } from './browser-storage.js';
import { BaseSingleton } from '../../utilities/utilities.js';

type SettingsData = Partial<
  Pick<
    STORAGE_DATA_OBJECT<any>,
    'flowDirection' | 'groupBkmFol' | 'pins' | 'colCount' | 'homePin' | 'themes' | 'currTheme'
  >
>;

export class SettingsDAO
  extends BaseSingleton
  implements StorageDAO<RetainedState | { currTheme?: Theme }>
{
  static get instance(): SettingsDAO {
    return BaseSingleton._getInstance(SettingsDAO) || new SettingsDAO();
  }

  load(): Promise<RetainedState | { currTheme?: Theme }> {
    return new Promise((res) => {
      BrowserStorage.instance.loadData((data) => {
        let themes: Theme[], currTheme: Theme | undefined;
        try {
          themes = data.themes?.map((theme: any) => JSON.parse(theme)) || [];
          currTheme = themes.find((theme) => theme.themeId === data.currTheme) || themes[0];
        } catch (err) {
          themes = [];
          currTheme = undefined;
        }

        let state = {
          flowDirection: data.flowDirection,
          bkmDisplayOrder: data.groupBkmFol
            ? BKM_DISPLAY_ORDER.groupAndSort
            : BKM_DISPLAY_ORDER.default,
          pinnedFolders: [],
          folderPinIds: data.pins,
          bkmFolderColCount: data.colCount,
          homeFolder: data.homePin,
          themes,
          currTheme
        };
        res(state);
      });
    });
  }
  save(data: RetainedState): void {
    let saveData: SettingsData = {};

    if (data.flowDirection) saveData.flowDirection = data.flowDirection.toString();
    if (data.bkmDisplayOrder || data.bkmDisplayOrder === 0)
      saveData.groupBkmFol = data.bkmDisplayOrder === BKM_DISPLAY_ORDER.groupAndSort;
    if (data.pinnedFolders) saveData.pins = data.pinnedFolders.map((pin) => pin.id);
    if (data.bkmFolderColCount) saveData.colCount = data.bkmFolderColCount;
    if (data.homeFolder) saveData.homePin = data.homeFolder;
    if (data.themes) saveData.themes = data.themes.map((theme) => JSON.stringify(theme));
    if (data.currTheme) saveData.currTheme = data.currTheme.themeId;

    BrowserStorage.instance.setData(saveData);
  }
}
