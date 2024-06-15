// prettier-ignore
import {
  BrowserBkmNode, BookmarkTreeDataNode, NodeType, BookmarkTreeNode, FLOW,

  BkmEvent, BkmEventType,
  ChReordered, ChangedEvent, CreatedEvent,
  MovedEvent, RemovedEvent, ImportEndEvent,

  Search, StorageDAO, IconObj, BookmarkSliceState,
  DropInfo, DragstartInfo, DragstartType, DragoverOrDropType, SearchData,
  ReadonlyBkmCache
} from '@proj-types';
import { EventManager } from './event-manager.js';
import { SearchFactory } from './search.js';
import {
  OrderedMap,
  DefaultBrowserRootNode,
  NotImplmentedError
} from '../../../utilities/utilities.js';
import { BaseSingleton } from '../../../utilities/utilities.js';
import { BookmarksDAO } from '../../../data/dao/bookmarks-dao.js';
import { DragDropClassCSS } from '@proj-const';

export class BookmarkCache extends EventManager {
  private _isSynced: boolean = false;
  override get isSynced(): boolean {
    return this._isSynced;
  }
  protected override _getDaoInstance(): StorageDAO<any> {
    return BookmarksDAO.instance;
  }

  /**
   * This class does not have a sync or loadFromSavedData method. It updates the
   * class variables and then sends optimistic updates to browser's bookmark API.
   */
  override getSaveDataForSyncAndCommit(): any {
    throw new NotImplmentedError(BookmarkCache.name, 'getSaveDataForSyncAndCommit');
  }
  override loadFromSavedData(rootNodes: BrowserBkmNode[]): void {
    this.setRootNode(new DefaultBrowserRootNode(rootNodes));
    this._isSynced = true;
  }
  static get instance(): BookmarkCache {
    return BaseSingleton._getInstance(BookmarkCache) || new BookmarkCache();
  }
  get readonly(): ReadonlyBkmCache {
    return this;
  }

  constructor() {
    super(new DefaultBrowserRootNode([]));
    this._addListenserForBrowserEvents();
  }

  /**
   * Adds the icons data to the bookmark cache for search.
   * To be called after icon data is loaded.
   */
  syncTitlesFromIcons(iconData: IconObj) {
    let node: BookmarkTreeNode | undefined, title: string | undefined;

    for (let id in iconData) {
      node = this.getNode(id);
      title = iconData[id]?.title;

      if (node && title) {
        node.edit({ title });
        node.isIcon = true;
      }
    }
  }

  getAllNodes(id?: string): BookmarkTreeNode[] {
    let node = id ? this.getNode(id) : this.getRootNode();
    return node ? this._getAllNodeInTree(node) : [];
  }
  getAllBookmarks(id?: string): BookmarkTreeNode[] {
    return this.getAllNodes(id).filter((node) => node.type === NodeType.BKM);
  }
  getAllFolders(id?: string): BookmarkTreeNode[] {
    return this.getAllNodes(id).filter((node) => node.type === NodeType.FOL);
  }
  getAllChildren(id?: string | undefined): BookmarkTreeNode[] {
    let nodes = this.getAllNodes(id);
    nodes.shift();
    return nodes;
  }
  getNodeMap(ids: string[]): OrderedMap<string, BookmarkTreeNode> {
    let nodes: OrderedMap<string, BookmarkTreeNode> = new OrderedMap();

    ids.forEach((id) => {
      let node = this.getNode(id);
      node && nodes.add(node);
    });

    return nodes;
  }

  getParentChain(id: string): BookmarkTreeNode[] {
    let currNode = this.getNode(id);
    if (!currNode) return [];

    let chain = [currNode];
    while (currNode) {
      currNode = this.getNode(currNode.parentId);
      currNode && chain.push(currNode);
    }

    return chain;
  }

  get defaultNode() {
    return this.getRootNode().children[0] ?? this.getRootNode();
  }

  getCurrentState(currNodeId = '', query = ''): BookmarkSliceState {
    const currNode = ((currNodeId && this.getNode(currNodeId)) || this.defaultNode).dataTree;
    const currNodeParentChain = this.getParentChain(currNode.id).map((node) => node.dataTree);

    let state: BookmarkSliceState = {
      baseNodes: this.baseNodes,
      currNode,
      currNodeParentChain
    };

    if (query) {
      let search = this.search(currNodeId, query);
      state.showSearch = true;
      state.searchData = search;
    } else {
      state.showSearch = false;
      state.searchData = undefined;
    }

    return state;
  }

  get baseNodes(): BookmarkTreeDataNode[] {
    return this.getRootNode().children.map((node) => node.dataTree);
  }

  protected _afterBrowserEvent(event: BkmEvent): void {
    this.deSelectAll();
  }
  protected _dispatchBrowserEvent(event: BkmEvent) {
    BookmarksDAO.instance.dispatchBrowserEvent(event);
  }
  protected _addListenserForBrowserEvents() {
    let eventHandler = (event: BkmEvent) => this._executeEventFromBrowser(event);

    BookmarksDAO.instance.listenBrowserEvents({
      rmv: eventHandler,
      mov: eventHandler,
      chg: eventHandler,
      add: eventHandler,
      ord: eventHandler,
      imp: eventHandler
    });
  }

  private _searchCache: Search = SearchFactory();
  /**
   * Search is always within a folder - excluding the folder itself.
   */
  search(folId: string, query: string, querySeparator = ','): SearchData {
    folId = folId || this._rootNode.id;
    query = query || '';

    if (!query) {
      return this.clearSearch(), this._searchCache;
    }

    if (!this._searchCache || !this._searchCache.isSameAs({ folId, query })) {
      let nodes = this.getAllChildren(folId);
      this._searchCache = SearchFactory({
        folId,
        query,
        nodes,
        querySeparator
      });

      this._searchCache.execute();
    }

    return {
      folId: this._searchCache.folId,
      query: this._searchCache.query,
      nodes: this._searchCache.nodes.map((node) => {
        let dataTree = { ...node.dataTree };
        dataTree.children = [];

        return dataTree;
      }),
      result: this._searchCache.result.map((scoredNode) => {
        let score: any = { ...scoredNode };
        score.score = scoredNode.score;

        return score;
      }),
      stats: this._searchCache.stats
    };
  }
  clearSearch(): void {
    this._searchCache = SearchFactory();
  }

  selectRange(lastSelectedId: string, id: string) {
    let [startNode, endNode] = [this.getNode(lastSelectedId), this.getNode(id)];
    if (!startNode || !endNode || startNode.parentId !== endNode.parentId) return;

    let parent = this.getNode(startNode.parentId)!;

    let start = Math.min(startNode.index, endNode.index),
      end = Math.max(startNode.index, endNode.index);

    for (let i = start; i <= end; i++) {
      parent.children[i]!.selected = true;
    }
  }

  deSelectAll(parentId?: string) {
    this.getAllNodes(parentId).forEach((node) => node.selected && (node.selected = false));
  }
  private _getAllSelectedNodes(parentId?: string): BookmarkTreeNode[] {
    return this.getAllNodes(parentId).filter((node) => node.selected);
  }

  drop(dragInfo: DragstartInfo, dropInfo: DropInfo, flowDirection: FLOW) {
    let startNode = this.getNode(dragInfo.dragstartNode),
      dropNode = this.getNode(dropInfo.dropTarget ?? undefined);
    if (!this._isValidDrop(dragInfo, dropInfo) || !startNode || !dropNode) return;

    let moveEvent: MovedEvent = {
      type: BkmEventType.MOV,
      payload: {
        movedNodeId: startNode.id,
        index: 0,
        oldIndex: startNode.index,
        parentId: '',
        oldParentId: startNode.parentId
      }
    };

    let rowDirection = flowDirection === FLOW.Row,
      colDirection = !rowDirection;

    if (dropInfo.dropType === DragoverOrDropType.BKM) {
      moveEvent.payload.index = dropNode.index;
      moveEvent.payload.parentId = dropNode.parentId;

      rowDirection
        ? dropInfo.dropZone.lftHlf === DragDropClassCSS.RGT && moveEvent.payload.index++
        : dropInfo.dropZone.topHlf === DragDropClassCSS.BOT && moveEvent.payload.index++;
    } else if (dropInfo.dropType === DragoverOrDropType.FOL) {
      if (
        (!dropInfo.dropZone.topBot && colDirection) ||
        (!dropInfo.dropZone.lftRgt && rowDirection)
      ) {
        moveEvent.payload.parentId = dropNode.id;
      } else {
        moveEvent.payload.parentId = dropNode.parentId;
        moveEvent.payload.index = dropNode.index;

        rowDirection
          ? dropInfo.dropZone.lftRgt === DragDropClassCSS.RGT && moveEvent.payload.index++
          : dropInfo.dropZone.topBot === DragDropClassCSS.BOT && moveEvent.payload.index++;
      }
    } else if (dropInfo.dropType === DragoverOrDropType.PIN) {
      moveEvent.payload.parentId = dropNode.id;
    } else if (dropInfo.dropType === DragoverOrDropType.NOD_CONTAINER) {
      // moveEvent.payload.parentId = dropNode.id;
      return;
    }

    const moveEvents: MovedEvent[] = [moveEvent];
    {
      const selectedNodes = this._getAllSelectedNodes();
      const getMovePayload = (node: BookmarkTreeNode): MovedEvent => {
        return {
          type: BkmEventType.MOV,
          payload: {
            ...moveEvent.payload,
            movedNodeId: node.id
          }
        };
      };
      selectedNodes.forEach((node) => {
        if (node.id === startNode!.id) return;
        moveEvents.push(getMovePayload(node));
      });
    }

    moveEvents.forEach((event) => this.executeEvent(event));
  }
  private _isValidDrop(dragInfo: DragstartInfo, dropInfo: DropInfo): boolean {
    if (dragInfo.dragType === DragstartType.BKM || dragInfo.dragType === DragstartType.FOL) {
      if (
        dropInfo.dropType === DragoverOrDropType.FOL ||
        dropInfo.dropType === DragoverOrDropType.BKM
      ) {
        return true;
      } else if (dropInfo.dropType === DragoverOrDropType.PIN) {
        if (dragInfo.dragType === DragstartType.FOL && dropInfo.dropZone.topBot) {
          let droppedOnBaseNode =
            this.baseNodes.findIndex((node) => node.id === dropInfo.dropTarget) !== -1;
          return droppedOnBaseNode;
        }
        return true;
      } else if (dropInfo.dropType === DragoverOrDropType.NOD_CONTAINER) {
        return true;
      }
    }
    return false;
  }
  getDuplicates(): Promise<BookmarkTreeDataNode[][]> {
    return new Promise((resolve) => {
      let duplicates = [] as BookmarkTreeDataNode[][],
        allNodes = this.getAllBookmarks().filter((node) => node.url);

      const compareUrl = (url: string) => {
        let i = url.indexOf('#');
        return i === -1 ? url : url.substring(0, i);
      };
      allNodes.forEach((node) => {
        (<any>node).__compareUrl = compareUrl(node.url);
      });
      allNodes.sort((a, b) => {
        if ((<any>a).__compareUrl! === (<any>b).__compareUrl!) return 0;
        return (<any>a).__compareUrl! > (<any>b).__compareUrl! ? 1 : -1;
      });

      for (let i = 0; i < allNodes.length; ) {
        let j = i + 1,
          matched = false,
          currNode = allNodes[i]!,
          nodeGroup = [currNode.dataTree],
          urlI = (<any>currNode).__compareUrl;

        while (j < allNodes.length) {
          if ((<any>allNodes[j]).__compareUrl === urlI) {
            matched = true;
            nodeGroup.push(allNodes[j++]!);
          } else break;
        }

        i = j;
        matched && duplicates.push(nodeGroup);
      }
      allNodes.forEach((node) => {
        (<any>node).__compareUrl = '';
      });

      resolve(duplicates);
    });
  }
}
