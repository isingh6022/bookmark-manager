// prettier-ignore
import {
  BookmarkTreeDataNode, BookmarkTreeNode, MODE, PAGES,
  DragNodeData, DragstartType, DropZone,
  SyncedStorage, TransientState, PopupConfig,
  DropInfo, DragstartInfo,
  ReadonlyTransientCache
} from '@proj-types';
import {
  BaseSingleton,
  InvalidArgumentError,
  NotImplmentedError,
  Util
} from '../../utilities/utilities.js';
import { initTransientState } from './init-states/init-transient-state.js';

export class TransientStateCache extends BaseSingleton implements SyncedStorage<TransientState> {
  static get instance(): TransientStateCache {
    return BaseSingleton._getInstance(TransientStateCache) || new TransientStateCache();
  }
  get readonly(): ReadonlyTransientCache {
    return this;
  }
  get isSynced(): boolean {
    return true;
  }
  get initialized(): boolean {
    return true;
  }
  private _currentState = initTransientState;
  getCurrentState(): TransientState {
    let state = { ...this._currentState };
    state.dragDrop = { ...this._currentState.dragDrop };
    state.popup = this._currentState.popup ? { ...this._currentState.popup } : null;

    return state;
  }
  setBkmPage(folderId: string): boolean {
    let visitedIds = this._currentState.visitedFolderIds;
    this._currentState.currPage = PAGES.bkmFolder;

    if (visitedIds[visitedIds.length - 1] === folderId) return false;

    this._currentState.visitedFolderIds.push(folderId);
    this._currentState.currMode = MODE.default;

    return true;
  }
  setOtherPage(page: PAGES): boolean {
    if (page === PAGES.bkmFolder) {
      throw new InvalidArgumentError(TransientStateCache.name, 'setOtherPage', 'page', page);
    }
    if (this._currentState.currPage === page) return false;

    this._currentState.currPage = page;
    return true;
  }
  set mode(mode: MODE) {
    this._currentState.currMode = mode;
  }
  setDragstart(dragstartInfo: DragstartInfo, dragstartNode: DragNodeData) {
    this._currentState.dragDrop.dragging = true;

    this._currentState.dragDrop.dragstartType = dragstartInfo.dragType;
    this._currentState.dragDrop.dragstartNode = dragstartNode;

    this._currentState.dragDrop.dragDropId = Util.misc.getUniqueId();
  }

  private _prevDragstartInfo: DragstartInfo | null = null;
  get prevDragstartInfo(): DragstartInfo | null {
    return this._prevDragstartInfo;
  }
  dragEnd() {
    // Might be called multiple times for each drag-drop operation - should not be though.
    if (this._currentState.dragDrop.dragstartNode) {
      this._prevDragstartInfo = {
        dragstartNode: this._currentState.dragDrop.dragstartNode!.id,
        dragType: this._currentState.dragDrop.dragstartType!
      };
    }

    this._currentState.dragDrop.dragging = false;
    this._currentState.dragDrop.dragstartNode = undefined;
    this._currentState.dragDrop.dragstartType = undefined;

    this._currentState.dragDrop.dragDropId = Util.misc.getUniqueId();
  }

  set popup(options: PopupConfig | null) {
    if (options) {
      this._currentState.popup = { ...options };
      this._currentState.popup.popupId = Util.misc.getUniqueId();
    } else {
      this._currentState.popup = null;
    }
  }

  afterInit(fn: () => void): void {
    fn();
  }
  getSaveDataForSyncAndCommit(): any {
    throw new NotImplmentedError(TransientStateCache.name, 'getSaveDataForSyncAndCommit');
  }
  loadFromSavedData(data: any): void {
    throw new NotImplmentedError(TransientStateCache.name, 'loadFromSavedData');
  }
}
