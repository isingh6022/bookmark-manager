import {
  BkmDisplayOrder,
  BookmarkTreeNode,
  DragoverOrDropType,
  DragstartInfo,
  DragstartType,
  DropInfo,
  Flow,
  ReadonlySettingsCache,
  RetainedState,
  Theme
} from '@proj-types';
import { BaseSingleton, Util } from '../../utilities/utilities.js';
import { BaseCache } from './baseCache.js';
import { SettingsDAO } from '../../data/dao/settings-dao.js';
import { initSettingsState } from './init-states/init-settings-state.js';
import { THEME_CONST, DragDropClassCSS } from '@proj-const';
import { ThemeHelper } from '@proj-scripts';

export class SettingsCache extends BaseCache<RetainedState> {
  protected override _getDaoInstance(): SettingsDAO {
    return SettingsDAO.instance;
  }
  static get instance(): SettingsCache {
    return BaseSingleton._getInstance(SettingsCache) || new SettingsCache();
  }
  get readonly(): ReadonlySettingsCache {
    return this;
  }

  private _currentState: RetainedState = initSettingsState;

  getCurrentState(): RetainedState {
    return { ...this._currentState, themes: [...(this._currentState.themes || [])] };
  }

  private _outOfSyncData: Partial<RetainedState> = {};
  private _clearOutOfSyncData(): void {
    this._outOfSyncData = {};
  }

  set flowDirection(val: Flow) {
    if (this._currentState.flowDirection === val) {
      return;
    }
    this._outOfSyncData.flowDirection = this._currentState.flowDirection = val;
    this._updateStorage();
  }
  set bkmDisplayOrder(val: BkmDisplayOrder) {
    if (this._currentState.bkmDisplayOrder === val) {
      return;
    }
    this._outOfSyncData.bkmDisplayOrder = this._currentState.bkmDisplayOrder = val;
    this._updateStorage();
  }
  set pinnedFolders(val: { id: string; title: string; removable: boolean }[]) {
    if (this._currentState.pinnedFolders === val) {
      return;
    }
    this._outOfSyncData.pinnedFolders = this._currentState.pinnedFolders = val;
    this._updateStorage();
  }
  set bkmFolderColCount(val: number) {
    if (this._currentState.bkmFolderColCount === val) {
      return;
    }
    this._outOfSyncData.bkmFolderColCount = this._currentState.bkmFolderColCount = val;
    this._updateStorage();
  }
  set homeFolder(val: string) {
    if (this._currentState.homeFolder === val) {
      return;
    }
    // if (val && this._currentState.pinnedFolders.findIndex((pin) => pin.id === val) !== -1) {
    this._outOfSyncData.homeFolder = this._currentState.homeFolder = val;
    this._updateStorage();
    // }
  }
  set currTheme(val: string) {
    let newCurrTheme = this._currentState.themes.find((theme) => theme.themeId === val);
    if (newCurrTheme) {
      if (
        this._currentState.currTheme.themeId === val &&
        this._currentState.currTheme.changeId === newCurrTheme.changeId
      ) {
        return;
      }
      this._outOfSyncData.currTheme = this._currentState.currTheme = newCurrTheme;
      this._updateStorage();
    }
  }
  set themes(val: Theme[]) {
    if (this._currentState.themes === val) {
      return;
    }
    this._outOfSyncData.themes = this._currentState.themes = val;

    if (this._currentState.currTheme) {
      // currTheme is not present during initialization.
      this.currTheme = this._currentState.currTheme.themeId;
    }
    this._updateStorage();
  }

  editPin(id: string, title: string) {
    let pin = this._currentState.pinnedFolders.find((pin) => pin.id === id);
    if (pin) {
      pin.title = title;
    }
  }

  get isSynced(): boolean {
    return !Object.keys(this._outOfSyncData).length;
  }
  getSaveDataForSyncAndCommit(): Partial<RetainedState> {
    let _outOfSyncData = { ...this._outOfSyncData };
    this._clearOutOfSyncData();

    return _outOfSyncData;
  }

  private _initiallyPinnedIds: string[] = [];
  get initiallyPinnedIds() {
    return this._initiallyPinnedIds;
  }
  loadFromSavedData(state: Partial<RetainedState> & { folderPinIds: string[] }): void {
    const themes: Theme[] = (state.themes || [])
      .filter((theme) => !!theme)
      .map((theme) => ThemeHelper.parseTheme(theme))
      .filter((theme) => theme.name !== THEME_CONST.defaults.unnamed);

    this._initiallyPinnedIds = state.folderPinIds || [];

    this._currentState = { ...this._currentState, ...state, themes };
    this._clearOutOfSyncData();
    this._checkAndUpdateStateBeforeInit();
  }
  private _checkAndUpdateStateBeforeInit() {
    const defaultThemes = ThemeHelper.getDefaultThemes();
    let dataErrors = false;

    if (!this._currentState.themes?.length) {
      this.themes = defaultThemes;
      this._outOfSyncData.currTheme = this._currentState.currTheme = defaultThemes[0]!;
      dataErrors = true;
    } else {
      //  replace default themes with their recently generated objects - for updates.
      const defaultThemeIds = new Set<string>(defaultThemes.map((theme) => theme.themeId));
      this._currentState.themes = [
        ...defaultThemes,
        ...this._currentState.themes.filter((theme) => !defaultThemeIds.has(theme.themeId))
      ];

      let currThemeId = this._currentState.currTheme?.themeId;
      if (!currThemeId) {
        currThemeId = defaultThemes[0]!.themeId;
        dataErrors = true;
      }

      let currThemeIndex = this._currentState.themes.findIndex(
        (theme) => theme.themeId === currThemeId
      );
      if (currThemeIndex === -1) {
        this._outOfSyncData.currTheme = this._currentState.currTheme = defaultThemes[0]!;
        dataErrors = true;
      } else {
        this._currentState.currTheme = this._currentState.themes[currThemeIndex]!;
      }
    }

    // if (this._currentState.homeFolder) {
    //   let homeFolIndex = this._currentState.pinnedFolders.findIndex(
    //     (pin) => pin.id === this._currentState.homeFolder
    //   );
    //   if (homeFolIndex === -1) {
    //     this._outOfSyncData.homeFolder = this.homeFolder = '';
    //     dataErrors = true;
    //   }
    // }

    dataErrors && this._updateStorage();
  }

  drop(
    dragInfo: DragstartInfo,
    dropInfo: DropInfo,
    startNode: BookmarkTreeNode,
    dropNode?: BookmarkTreeNode
  ): void {
    if (!this._isValidDrop(dragInfo, dropInfo)) return;

    let pins = [...this._currentState.pinnedFolders];
    const findPinIndex = (pinId: string) => pins.findIndex((pin) => pinId === pin.id);

    if (dragInfo.dragType === DragstartType.FOL) {
      let currIndex = findPinIndex(startNode.id),
        newPin = { id: startNode.id, title: startNode.title, removable: true };
      currIndex !== -1 && pins.splice(currIndex, 1);

      if (dropInfo.dropType === DragoverOrDropType.PIN_CONTAINER) {
        pins.unshift(newPin);
      } else {
        let dropPinIndex = findPinIndex(dropNode!.id);
        if (dropPinIndex === -1) return;

        let before = dropInfo.dropZone.topHlf === DragDropClassCSS.TOP;
        pins.splice(before ? dropPinIndex : dropPinIndex + 1, 0, newPin);
      }
    } else {
      let startPinIndex = findPinIndex(startNode.id),
        dropPinIndex = findPinIndex(dropNode!.id);
      if (startPinIndex === -1 || dropPinIndex === -1) return;

      let before = dropInfo.dropZone.topHlf === DragDropClassCSS.TOP;
      Util.misc.moveArrElementFromTo(pins, startPinIndex, before ? dropPinIndex : dropPinIndex + 1);
    }

    this.pinnedFolders = pins;
  }
  private _isValidDrop(dragInfo: DragstartInfo, dropInfo: DropInfo): boolean {
    if (
      (dragInfo.dragType === DragstartType.FOL &&
        dropInfo.dropType === DragoverOrDropType.PIN_CONTAINER) ||
      ((dragInfo.dragType === DragstartType.PIN ||
        (!dropInfo.dropZone.middle && dragInfo.dragType === DragstartType.FOL)) &&
        dropInfo.dropType === DragoverOrDropType.PIN)
    ) {
      return true;
    }
    return false;
  }
}
