// prettier-ignore
import {
  BkmEventType, BookmarkSliceState, BrowserBkmNode, BookmarkTreeNode, BookmarkTreeDataNode,
  RemovedEvent, MovedEvent, ChangedEvent, CreatedEvent, ChReordered, ImportEndEvent, DropInfo,
  DragstartInfo
} from '@proj-types';
import { BaseSingleton, ToDo } from '../utilities/utilities.js';
import { BaseService } from './base-service.js';
import {
  BookmarkCache,
  IconsCache,
  TransientStateCacheReadonly,
  SettingsCacheReadonly
} from './caches/caches.js';

export class BookmarkService extends BaseService {
  static get instance(): BookmarkService {
    return BaseSingleton._getInstance(BookmarkService) || new BookmarkService();
  }
  private get _cache() {
    return BookmarkCache;
  }

  private _initializedBkmCache: boolean = false;
  private _initializedIcoCache: boolean = false;
  get initialized(): boolean {
    return this._initializedBkmCache && this._initializedIcoCache;
  }
  constructor() {
    super();

    this.afterInit(() => this._cache.syncTitlesFromIcons(IconsCache.getCurrentState()));

    this._cache.afterInit(() => {
      this._initializedBkmCache = true;
      this.initialized && this._initCallbacks();
    });
    IconsCache.afterInit(() => {
      this._initializedIcoCache = true;
      this.initialized && this._initCallbacks();
    });
  }

  getInitState(): BookmarkSliceState {
    this._cache.deSelectAll();
    return this._cache.getCurrentState();
  }
  updateStateObject(targetState: BookmarkSliceState, query?: string): void {
    let sourceState = this._cache.getCurrentState(targetState.currNode.id, query),
      node = this._cache.getNode(sourceState.currNode.id);

    if (node && node.selected) {
      node.selected = false;
    }

    targetState.baseNodes = sourceState.baseNodes;
    targetState.currNode = sourceState.currNode;
    targetState.showSearch = sourceState.showSearch;
    targetState.searchData = sourceState.searchData;
    targetState.currNodeParentChain = sourceState.currNodeParentChain;
  }

  onBrowserUpdate(cb: Function) {
    this._cache.onBrowserUpdate(cb);
  }

  setCurrentNode(oldState: BookmarkSliceState, id?: string): void {
    let node = (this._cache.getNode(id) || this._cache.defaultNode).dataTree,
      oldNodeId = oldState.currNode.id;

    oldState.currNode = node;
    id !== oldNodeId && this.deselectAllAndUpdateState(oldState);
    this.updateStateObject(oldState, oldState.searchData?.query);
  }

  rmv(oldState: BookmarkSliceState, payload: string): void {
    let node = this._cache.getNode(payload);
    if (!node) return;

    let rmvEvent: RemovedEvent['payload'] = {
      removedNodeId: node.id,
      parentId: node.parentId,
      index: 0,
      node: node
    };

    this._cache.executeEvent({ type: BkmEventType.RMV, payload: rmvEvent });
    IconsCache.rmvIco(rmvEvent.removedNodeId);
    this.updateStateObject(oldState, oldState.searchData?.query || '');
  }
  mov(oldState: BookmarkSliceState, payload: MovedEvent['payload']): void {
    this._cache.executeEvent({ type: BkmEventType.MOV, payload });
    this.updateStateObject(oldState, oldState.searchData?.query || '');
  }
  add(oldState: BookmarkSliceState, payload: CreatedEvent['payload']): void {
    this._cache.executeEvent({ type: BkmEventType.ADD, payload });
    this.updateStateObject(oldState, oldState.searchData?.query || '');
  }
  chg(oldState: BookmarkSliceState, payload: ChangedEvent['payload']): void {
    let node = this._cache.getNode(payload.changedNodeId);
    if (node && payload.title && node.title !== payload.title) {
      IconsCache.rmvIco(payload.changedNodeId);
    }

    this._cache.executeEvent({ type: BkmEventType.CHG, payload });
    this.updateStateObject(oldState, oldState.searchData?.query || '');
  }
  ord(oldState: BookmarkSliceState, payload: ChReordered['payload']): void {
    this._cache.executeEvent({ type: BkmEventType.ORD, payload });
    this.updateStateObject(oldState, oldState.searchData?.query || '');
  }
  imp(oldState: BookmarkSliceState, payload: ImportEndEvent['payload']): void {
    // TO_DO...
    // BkmUtil.executeEventoldState type:oldState.IMP, payload: action.payload });
    this.updateStateObject(oldState, oldState.searchData?.query || '');
    return;
  }
  ico(oldState: BookmarkSliceState, payload: string): void {
    let node = BookmarkCache.getNode(payload);
    if (node) {
      let title = node.title || '',
        payload: ChangedEvent['payload'] = { changedNodeId: node.id, title: '' };

      IconsCache.addIco(node.id, title);
      node.isIcon = true;

      this._cache.executeEvent({ type: BkmEventType.CHG, payload }, false, false);
      this.updateStateObject(oldState);
    }
  }
  rmvIco(oldState: BookmarkSliceState, payload: string): void {
    let node = BookmarkCache.getNode(payload);
    IconsCache.rmvIco(payload);

    if (node) {
      let payload: ChangedEvent['payload'] = { changedNodeId: node.id, title: node.title };

      node.isIcon = false;
      this._cache.executeEvent({ type: BkmEventType.CHG, payload }, false, false);
      this.updateStateObject(oldState);
    }
  }

  showNode(oldState: BookmarkSliceState, id: string, showInParent?: boolean): void {
    throw new ToDo(BookmarkService.name, 'showNode');
  }

  updateRootNodes(oldState: BookmarkSliceState, nodes: BrowserBkmNode[]) {
    this._cache.loadFromSavedData(nodes);
    this.updateStateObject(oldState, '');
  }

  selectDeSelectNode(
    state: BookmarkSliceState,
    id: string,
    lastSelectedId?: string,
    options: { shiftKey?: boolean; selectOnly?: boolean; deselectOnly?: boolean } = {}
  ) {
    let node = this._cache.getNode(id);
    if (!node) {
      return;
    }

    if (options.selectOnly) {
      if (!node.selected) {
        node.selected = true;
        state.lastSelectedId = id;

        this.updateStateObject(state, state.searchData?.query || '');
      }
      return;
    } else if (options.deselectOnly) {
      if (node.selected) {
        node.selected = false;
        state.lastSelectedId = '';

        this.updateStateObject(state, state.searchData?.query || '');
      }
      return;
    }

    if (node.selected) {
      node.selected = false;
      state.lastSelectedId = '';
    } else {
      node.selected = true;
      if (options.shiftKey && lastSelectedId) {
        this._cache.selectRange(lastSelectedId, id);
      }
      state.lastSelectedId = id;
    }

    this.updateStateObject(state, state.searchData?.query || '');
  }

  deselectAllAndUpdateState(state: BookmarkSliceState, parentId?: string) {
    this._cache.deSelectAll(parentId);
    state.lastSelectedId = '';
    this.updateStateObject(state, state.searchData?.query || '');
  }

  drop(state: BookmarkSliceState, dropInfo: DropInfo) {
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

    this._cache.drop(
      dragstartInfo,
      dropInfo,
      SettingsCacheReadonly.getCurrentState().flowDirection
    );
    this.updateStateObject(state, state.searchData?.query || '');
  }

  getDuplicates(): Promise<
    { node: BookmarkTreeDataNode; parentChain: BookmarkTreeDataNode[] }[][]
  > {
    let duplicates = this._cache.getDuplicates();
    const getParentAndNode = (node: BookmarkTreeDataNode) => {
      return {
        node,
        parentChain: this._cache.getParentChain(node.id).map((node) => node.dataTree)
      };
    };

    return duplicates.then((nodeGroups) =>
      nodeGroups.map((nodeGroup) => {
        return nodeGroup.map((node) => getParentAndNode(node));
      })
    );
  }

  searchNodes(state: BookmarkSliceState, query: string) {
    this.updateStateObject(state, query);
  }
}
