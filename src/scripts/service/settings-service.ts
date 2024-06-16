import {
  BKM_DISPLAY_ORDER,
  DragstartInfo,
  DropInfo,
  FLOW,
  RetainedState,
  Theme
} from '@proj-types';
import { BaseSingleton, Util } from '../utilities/utilities.js';
import { BaseService } from './base-service.js';
import {
  SettingsCache,
  BookmarkCacheReadonly,
  TransientStateCacheReadonly
} from './caches/caches.js';
import { THEME_CONST } from '@proj-const';
import { ThemeHelper } from '@proj-scripts';

export class SettingsService extends BaseService {
  private _initialized: boolean = false;
  get initialized(): boolean {
    return this._initialized;
  }
  get _cache() {
    return SettingsCache;
  }
  constructor() {
    super();
    this._cache.afterInit(() => {
      this._initialized = true;
      this._initCallbacks();

      this._showCurrTheme();
    });
  }

  static get instance(): SettingsService {
    return BaseSingleton._getInstance(SettingsService) || new SettingsService();
  }

  override getInitState(): RetainedState {
    return { ...this._cache.getCurrentState() };
  }

  initSettingState(state: RetainedState): void {
    let initialPinIds = this._cache.initiallyPinnedIds;
    this.setPinnedFolders(state, initialPinIds);

    let currState = this._cache.getCurrentState();
    if (
      currState.homeFolder &&
      (!BookmarkCacheReadonly.hasNode(currState.homeFolder) ||
        !state.pinnedFolders.find((pin) => pin.id === currState.homeFolder))
    ) {
      this._cache.homeFolder = '';
      state.homeFolder = undefined;
    }
  }
  updateStateObject(state: RetainedState): void {
    let currState = this._cache.getCurrentState();

    state.flowDirection = currState.flowDirection;
    state.bkmDisplayOrder = currState.bkmDisplayOrder;
    state.pinnedFolders = this._getPinnedFolders(currState);
    state.homeFolder = currState.homeFolder;
    state.bkmFolderColCount = currState.bkmFolderColCount;
    state.themes = currState.themes.map((theme) => Util.misc.cloneSerializable(theme));
    state.currTheme = state.themes.find((theme) => theme.name === currState.currTheme.name)!;
  }
  private _getPinnedFolders(state: RetainedState) {
    return [
      ...BookmarkCacheReadonly.baseNodes.map((node) => ({
        id: node.id,
        title: node.title,
        removable: false
      })),
      ...state.pinnedFolders.map((pin) => ({ ...pin }))
    ];
  }

  setFlowDirection(state: RetainedState, val: FLOW) {
    this._cache.flowDirection = val;
    this.updateStateObject(state);
  }
  setBkmDisplayOrder(state: RetainedState, val: BKM_DISPLAY_ORDER) {
    this._cache.bkmDisplayOrder = val;
    this.updateStateObject(state);
  }
  setPinnedFolders(state: RetainedState, idList: string[]) {
    const allPins: { id: string; title: string; removable: boolean }[] = idList
      .map((id) => BookmarkCacheReadonly.getNode(id))
      .filter((node) => !!node)
      .map((node) => ({ id: node!.id, title: node!.title, removable: true }));

    this._updatePins(allPins);
    this.updateStateObject(state);
  }
  addPinnedFolder(state: RetainedState, id: string, index: number = 0) {
    let pinData = BookmarkCacheReadonly.getNode(id);
    if (pinData) {
      let title = pinData.title ?? '';
      index = index >= 0 && index <= state.pinnedFolders.length ? index : 0;
      state.pinnedFolders.splice(index, 0, { id, title, removable: true });
      this._updatePins(state.pinnedFolders);
      this.updateStateObject(state);
    }
  }
  editPin(state: RetainedState, id: string, title: string) {
    this._cache.editPin(id, title);
    this.updateStateObject(state);
  }
  unpinFolder(state: RetainedState, id: string) {
    let index = state.pinnedFolders.findIndex((pin) => pin.id === id);
    if (index !== -1) {
      state.pinnedFolders.splice(index, 1);
      this._updatePins(state.pinnedFolders);
      this.updateStateObject(state);
    }
  }
  private _updatePins(pins: RetainedState['pinnedFolders']): void {
    let fixedPins = new Set<string>(BookmarkCacheReadonly.baseNodes.map((node) => node.id));
    pins = pins.filter((pin) => !fixedPins.has(pin.id));
    this._cache.pinnedFolders = pins.map((pin) => ({ ...pin }));
  }

  private _getThemeChangeId(): string {
    return ThemeHelper.getThemeChangeId();
  }
  addTheme(state: RetainedState, newTheme: Theme, update = true): Theme | null {
    if (state.themes.findIndex((theme) => theme.name === newTheme.name) === -1) {
      newTheme.themeId = this._getThemeChangeId();
      newTheme.changeId = this._getThemeChangeId();

      state.themes.push(newTheme);
      this._updateThemes(state.themes);

      if (update) {
        this._showCurrTheme();
        this.updateStateObject(state);
      }

      return newTheme;
    }

    return null;
  }
  edtTheme(state: RetainedState, editedTheme: Theme) {
    let index = state.themes.findIndex((theme) => theme.themeId === editedTheme.themeId);

    if (!THEME_CONST.permanentThemeIds.has(editedTheme.themeId) && index !== -1) {
      editedTheme.changeId = this._getThemeChangeId();
      state.themes[index] = editedTheme;
      this._updateThemes(state.themes);

      this._showCurrTheme();
      this.updateStateObject(state);
    }
  }
  rmvTheme(state: RetainedState, themeId: string) {
    let index = state.themes.findIndex((theme) => theme.themeId === themeId);

    if (!THEME_CONST.permanentThemeIds.has(themeId) && index !== -1) {
      state.themes.splice(index, 1);
      this._updateThemes(state.themes);
      if (state.currTheme.themeId === themeId) {
        this._cache.currTheme = state.themes[0]!.themeId;
      }
      this._showCurrTheme();
      this.updateStateObject(state);
    }
  }
  private _updateThemes(themes: RetainedState['themes']): void {
    this._cache.themes = themes.map((theme) => Util.misc.cloneSerializable(theme));
  }
  private _showCurrTheme() {
    let theme = this._cache.getCurrentState().currTheme;
    ThemeHelper.showTheme(theme);
  }

  setCurrTheme(state: RetainedState, themeId: string) {
    if (
      state.currTheme.themeId !== themeId &&
      state.themes.findIndex((theme) => theme.themeId === themeId) !== -1
    ) {
      this._cache.currTheme = themeId;
      this._showCurrTheme();
      this.updateStateObject(state);
    }
  }

  /**
   * Usually the service class does not have getters, it simply has methods to
   * handle events and to fetch current state.
   *
   * @returns Home folder id.
   */
  getHomeFolder(): string | undefined {
    return this._cache.getCurrentState().homeFolder;
  }
  setHomeFolder(state: RetainedState, id: string) {
    if (state.pinnedFolders.findIndex((pin) => pin.id === id) !== -1) {
      this._cache.homeFolder = id;
      this.updateStateObject(state);
    }
  }

  setBkmFolderColCount(state: RetainedState, val: number) {
    this._cache.bkmFolderColCount = val;
    this.updateStateObject(state);
  }

  drop(state: RetainedState, dropInfo: DropInfo) {
    const transientState = TransientStateCacheReadonly.getCurrentState();
    if (
      !transientState.dragDrop.dragging ||
      !transientState.dragDrop.dragstartNode ||
      transientState.dragDrop.dragstartType === undefined
    ) {
      return;
    }

    let dragstartInfo: DragstartInfo = {
      dragstartNode: transientState.dragDrop.dragstartNode.id,
      dragType: transientState.dragDrop.dragstartType
    };

    let startNode = dragstartInfo && BookmarkCacheReadonly.getNode(dragstartInfo.dragstartNode),
      dropNode = dropInfo.dropTarget
        ? BookmarkCacheReadonly.getNode(dropInfo.dropTarget)
        : undefined;
    if (!dragstartInfo || !startNode) return;

    this._cache.drop(dragstartInfo, dropInfo, startNode, dropNode);
    this.updateStateObject(state);
  }
}
