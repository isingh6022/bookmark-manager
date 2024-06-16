// prettier-ignore
import {
  BookmarkTreeDataNode, MODE, PAGES,
  DragNodeData, DragstartType, DropZone,
  TransientState,
  PopupConfig,
  DropInfo, DragstartInfo, Popup, ConfirmPopup,
  NewFolderPopup,
  PropertiesPopup,
  NodeType,
  DeleteFolderPopup
} from '@proj-types';
import { BaseSingleton, InvalidArgumentError } from '../utilities/utilities.js';
import { TransientStateCache, BookmarkCacheReadonly } from './caches/caches.js';

export class TransientStateService extends BaseSingleton {
  get initialized(): boolean {
    return true;
  }
  get _cache() {
    return TransientStateCache;
  }
  static get instance(): TransientStateService {
    return BaseSingleton._getInstance(TransientStateService) || new TransientStateService();
  }
  afterInit(fn: () => void): void {
    fn();
  }

  getInitState(): TransientState {
    let state = this._cache.getCurrentState();

    return {
      ...state,
      visitedFolderIds: [...state.visitedFolderIds],
      dragDrop: { ...state.dragDrop }
    };
  }
  updateState(targetState: TransientState): void {
    let currState = this._cache.getCurrentState();

    targetState.visitedFolderIds = [...currState.visitedFolderIds];
    targetState.currPage = currState.currPage;
    targetState.currMode = currState.currMode;

    targetState.dragDrop = { ...currState.dragDrop };
    targetState.popup = currState.popup ? { ...currState.popup } : null;
  }

  setPage(state: TransientState, pageVal: { page: PAGES; folderId?: string }) {
    // pageVal.page =
    //   pageVal.page === PAGES.recent && state.currPage === PAGES.recent
    //     ? PAGES.bkmFolder
    //     : pageVal.page;

    if (pageVal.page === PAGES.bkmFolder) {
      if (!pageVal.folderId || !BookmarkCacheReadonly.hasNode(pageVal.folderId)) {
        throw new InvalidArgumentError(
          TransientStateService.name,
          'set page',
          'folderId',
          pageVal?.folderId
        );
      }
      if (this._cache.setBkmPage(pageVal.folderId)) {
        state.visitedFolderIds = [...this._cache.getCurrentState().visitedFolderIds];
      }
    } else {
      this._cache.setOtherPage(pageVal.page);
    }

    state.currPage = pageVal.page;
  }

  setMode(state: TransientState, val: MODE) {
    this._cache.mode = val;

    if (state.currMode !== val) {
      state.currMode = val;
    }
  }

  private _getDragNodeData(id: string): DragNodeData | null {
    // dragstart is called only once, end might be called multiple times (shouldn't be though).
    // So start node should always be there.
    let node = BookmarkCacheReadonly.getNode(id)!;

    return {
      id: node.id,
      type: node.type,
      title: node.title
    };
  }
  dragstart(state: TransientState, dragStartInfo: DragstartInfo) {
    this._cache.setDragstart(dragStartInfo, this._getDragNodeData(dragStartInfo.dragstartNode)!);
    this.updateState(state);
  }
  dragend(state: TransientState) {
    this._cache.dragEnd();
    this.updateState(state);
  }

  private _onConfirm: (() => void) | null = null;
  setPopup(state: TransientState, options: PopupConfig | null) {
    if (!options) {
      this._cache.popup = null;
      this.updateState(state);
      this._onConfirm = null;
      return;
    }
    if (options.type === Popup.CONFIRM) {
      this._onConfirm = (<ConfirmPopup>options).onConfirm;
      delete (<any>options).onConfirm;
    } else if (options.type === Popup.NEW_FOL) {
      const newFolPopup = <NewFolderPopup>options;
      const parentNode =
        newFolPopup.parentId && BookmarkCacheReadonly.getNode(newFolPopup.parentId);

      if (parentNode) {
        newFolPopup.parentNode = { ...parentNode.dataTree, children: [] };
        newFolPopup.parentChain = BookmarkCacheReadonly.getParentChain(parentNode.id)
          .map((node) => node.dataTree)
          .map((node) => ({ ...node, children: [] }));
      } else {
        this.setPopup(state, null);
      }
    } else if (options.type === Popup.PROPERTIES) {
      const propPopup = <PropertiesPopup>options;
      const node = propPopup.nodeId && BookmarkCacheReadonly.getNode(propPopup.nodeId);

      if (node) {
        let nFol = 0,
          nBkm = 0;
        propPopup.node = { ...node.dataTree, children: [] };
        propPopup.parentChain = BookmarkCacheReadonly.getParentChain(node.id)
          .map((node) => node.dataTree)
          .map((node) => ({ ...node, children: [] }));

        BookmarkCacheReadonly.getAllChildren(node.id).forEach((node) => {
          node.type === NodeType.BKM ? nBkm++ : nFol++;
        });

        propPopup.folderStats = { nFol, nBkm };
      }
    } else if (options.type === Popup.DEL_FOL) {
      const propPopup = <DeleteFolderPopup>options;
      const node = propPopup.nodeId && BookmarkCacheReadonly.getNode(propPopup.nodeId);

      if (node) {
        let nFol = 0,
          nBkm = 0;
        propPopup.node = { ...node.dataTree, children: [] };
        propPopup.parentChain = BookmarkCacheReadonly.getParentChain(node.id)
          .map((node) => node.dataTree)
          .map((node) => ({ ...node, children: [] }));

        BookmarkCacheReadonly.getAllChildren(node.id).forEach((node) => {
          node.type === NodeType.BKM ? nBkm++ : nFol++;
        });

        propPopup.folderStats = { nFol, nBkm };
      }
    }
    this._cache.popup = options;
    this.updateState(state);
  }
  confirm(state: TransientState) {
    if (this._onConfirm) {
      this._onConfirm();
      this._onConfirm = null;
    }
    this.setPopup(state, null);
  }
}
