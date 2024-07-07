// prettier-ignore
import {
    BookmarkTreeNode, BrowserBkmNode,
    BrowserActionsAPI, BrowserEventsAPI, BrowserAPIs, STORAGE_DATA_OBJECT
} from '@proj-types';
import { ERR_MOVE_WITHIN_SELF } from '@proj-const';
import { MockBrowser } from './mock-browser/mock-browser.js';

// Browser Events.
class EventsAPI implements BrowserEventsAPI {
  onRemove(callback: (id: string, removeInfo: chrome.bookmarks.BookmarkRemoveInfo) => void): void {
    MockBrowser.bookmarks.onRemoved.addListener(callback);
  }
  onMove(callback: (id: string, moveInfo: chrome.bookmarks.BookmarkMoveInfo) => void): void {
    MockBrowser.bookmarks.onMoved.addListener(callback);
  }
  onEdit(callback: (id: string, changeInfo: chrome.bookmarks.BookmarkChangeInfo) => void): void {
    MockBrowser.bookmarks.onChanged.addListener(callback);
  }
  onCreate(callback: (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => void): void {
    MockBrowser.bookmarks.onCreated.addListener(callback);
  }
  onChReorder(
    callback: (id: string, reorderInfo: chrome.bookmarks.BookmarkReorderInfo) => void
  ): void {
    MockBrowser.bookmarks.onChildrenReordered.addListener(callback);
  }
  onImportEnd(callback: () => void): void {
    MockBrowser.bookmarks.onImportEnded.addListener(callback);
  }
  onStorageChange(
    callback: (
      changes: {
        [key: string]: chrome.storage.StorageChange;
      },
      areaName: 'sync' | 'local' | 'managed' | 'session'
    ) => void
  ): void {
    MockBrowser.storage.local.onChanged.addListener(callback);
  }
}

class ActionsAPI implements BrowserActionsAPI {
  getBkmIconSrc(url?: string): string {
    return url ? 'chrome://favicon/' + url : '';
  }

  store(keyValPairs: Partial<STORAGE_DATA_OBJECT>): Promise<void> {
    return MockBrowser.storage.local.set(keyValPairs);
  }
  getLocalStorage(keys: string | string[]): Promise<{
    [key: string]: any;
  }> {
    return MockBrowser.storage.local.get(keys);
  }

  removeBkm(id: string): Promise<void> {
    return MockBrowser.bookmarks.remove(id);
  }
  removeTree(id: string): Promise<void> {
    return MockBrowser.bookmarks.removeTree(id);
  }

  moveBk(id: string, target: { parentId: string; index?: number }): Promise<BrowserBkmNode> {
    return new Promise((res, rej) => {
      MockBrowser.bookmarks.move(id, target).then((node) => res(node));
    });
  }

  update(id: string, changes: chrome.bookmarks.BookmarkChangesArg): Promise<BrowserBkmNode> {
    // changes - title? and url?
    return MockBrowser.bookmarks.update(id, changes);
  }

  createNode(createData: {
    title?: string;
    url?: string;
    parentId?: string;
    index?: number;
  }): Promise<BrowserBkmNode> {
    return MockBrowser.bookmarks.create(createData);
  }

  getFullTree(): Promise<BrowserBkmNode[]> {
    return MockBrowser.bookmarks.getTree();
  }
}

const getMockAPIs = (): BrowserAPIs => {
  return { actions: new ActionsAPI(), events: new EventsAPI() };
};

export { getMockAPIs };
