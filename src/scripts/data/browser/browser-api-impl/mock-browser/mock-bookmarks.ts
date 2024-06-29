import { BrowserBkmNode } from '@proj-types';
import { NOT_SUPPORTED_FLAG } from '@proj-const';
import { GEN_MOCK_DATA } from './mock-data-gen/mock-nodes.js';
import { NodeGenerator } from './mock-data-gen/node-gen.js';
import { PersistantStorageRequests } from './persistStorageRequests.js';

const NO_SUPPORT_FLAG: any = NOT_SUPPORTED_FLAG;

/**
 * Signature similar to the chrome browser.
 */
class MockBookmarksEvents {
  private static _onRemoveHandler: Function = () => {};
  private static _onMoveHandler: Function = () => {};
  private static _onEditHandler: Function = () => {};
  private static _onCreateHandler: Function = () => {};
  private static _onChReorderHandler: Function = () => {};
  private static _onImportEndHandler: Function = () => {};

  private static _timeoutRef: any;

  private static _setHandler(
    handler: Function,
    type:
      | '_onRemoveHandler'
      | '_onMoveHandler'
      | '_onEditHandler'
      | '_onCreateHandler'
      | '_onChReorderHandler'
      | '_onImportEndHandler'
  ): void {
    this[type] = (...args: any[]) => {
      handler(...args);
      if (MockBookmarksEvents._timeoutRef) {
        clearTimeout(MockBookmarksEvents._timeoutRef);
      }
      MockBookmarksEvents._timeoutRef = setTimeout(
        () => PersistantStorageRequests.saveDataForDebug(),
        100
      );
    };
  }

  static readonly onRemoved = {
    addListener(handler: (id: string, removeInfo: chrome.bookmarks.BookmarkRemoveInfo) => void) {
      MockBookmarksEvents._setHandler(handler, '_onRemoveHandler');
    }
  };
  static readonly onMoved = {
    addListener(handler: (id: string, moveInfo: chrome.bookmarks.BookmarkMoveInfo) => void) {
      MockBookmarksEvents._setHandler(handler, '_onMoveHandler');
    }
  };
  static readonly onChanged = {
    addListener(handler: (id: string, changeInfo: chrome.bookmarks.BookmarkChangeInfo) => void) {
      MockBookmarksEvents._setHandler(handler, '_onEditHandler');
    }
  };
  static readonly onCreated = {
    addListener(handler: (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => void) {
      MockBookmarksEvents._setHandler(handler, '_onCreateHandler');
    }
  };
  static readonly onChildrenReordered = {
    addListener(handler: (id: string, reorderInfo: chrome.bookmarks.BookmarkReorderInfo) => void) {
      MockBookmarksEvents._setHandler(handler, '_onChReorderHandler');
    }
  };
  static readonly onImportEnded = {
    addListener(handler: () => void) {
      MockBookmarksEvents._setHandler(handler, '_onImportEndHandler');
    }
  };

  protected static _triggerOnRemoved(
    id: string,
    removeInfo: chrome.bookmarks.BookmarkRemoveInfo
  ): void {
    this._onRemoveHandler(id, removeInfo);
  }
  protected static _triggerOnMoved(id: string, moveInfo: chrome.bookmarks.BookmarkMoveInfo): void {
    this._onMoveHandler(id, moveInfo);
  }
  protected static _triggerOnChanged(
    id: string,
    changeInfo: chrome.bookmarks.BookmarkChangeInfo
  ): void {
    this._onEditHandler(id, changeInfo);
  }
  protected static _triggerOnCreated(
    id: string,
    bookmark: chrome.bookmarks.BookmarkTreeNode
  ): void {
    this._onCreateHandler(id, bookmark);
  }
  protected static _triggerOnChildrenReordered(
    id: string,
    reorderInfo: chrome.bookmarks.BookmarkReorderInfo
  ): void {
    this._onChReorderHandler(id, reorderInfo);
  }
  protected static _triggerOnImportEnded(): void {
    this._onImportEndHandler();
  }
}

class MockBookmarks extends MockBookmarksEvents {
  static remove(id: string): Promise<void> {
    setTimeout(() => this._triggerOnRemoved(id, NO_SUPPORT_FLAG));
    return new Promise((res) => null);
  }
  static removeTree(id: string): Promise<void> {
    setTimeout(() => this._triggerOnRemoved(id, NO_SUPPORT_FLAG));
    return new Promise((res) => null);
  }

  static move(id: string, target: { parentId: string; index?: number }): Promise<BrowserBkmNode> {
    setTimeout(() =>
      this._triggerOnMoved(id, {
        index: NO_SUPPORT_FLAG,
        ...target,
        oldIndex: NO_SUPPORT_FLAG,
        oldParentId: NO_SUPPORT_FLAG
      })
    );
    return Promise.resolve(NO_SUPPORT_FLAG);
  }

  static update(id: string, changes: chrome.bookmarks.BookmarkChangesArg): Promise<BrowserBkmNode> {
    // changes - title? and url?
    setTimeout(() => this._triggerOnChanged(id, { title: NO_SUPPORT_FLAG, ...changes }));
    return Promise.resolve(NO_SUPPORT_FLAG);
  }

  static create(createData: {
    title?: string;
    url?: string;
    parentId?: string;
    index?: number;
  }): Promise<BrowserBkmNode> {
    let newNode = NodeGenerator.createNode(createData);
    newNode.id = 'new-id' + Math.random();

    setTimeout(() => this._triggerOnCreated(newNode.id, newNode));
    return Promise.resolve(newNode);
  }

  static getTree(): Promise<BrowserBkmNode[]> {
    return new Promise((res) => {
      let t0 = performance.now();
      GEN_MOCK_DATA([210, 50]).then((mockData) => {
        console.log('Mock data: ', mockData, '\n in: ', (performance.now() - t0).toFixed(3), 'ms');
        res(mockData);
      });
    });
  }
}

export { MockBookmarks };
