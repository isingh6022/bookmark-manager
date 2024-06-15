// prettier-ignore
import {
  BookmarkTreeNode, BrowserBkmNode,
  BrowserActionsAPI, BrowserEventsAPI, BrowserAPIs, STORAGE_DATA_OBJECT
} from '@proj-types';
import { ERR_MOVE_WITHIN_SELF } from '@proj-const';

class ChromeActionsAPI implements BrowserActionsAPI {
  getBkmIconSrc(url?: string): string {
    // return url ? 'chrome://favicon/' + url : '';
    return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${url}&size=32`;
  }

  store(keyValPairs: Partial<STORAGE_DATA_OBJECT>): Promise<void> {
    return chrome.storage.local.set(keyValPairs);
  }
  getLocalStorage(keys: string | string[]): Promise<{
    [key: string]: any;
  }> {
    return chrome.storage.local.get(keys);
  }

  removeBkm(id: string): Promise<void> {
    return chrome.bookmarks.remove(id);
  }
  removeTree(id: string): Promise<void> {
    return chrome.bookmarks.removeTree(id);
  }

  moveBk(id: string, target: { parentId: string; index?: number }): Promise<BrowserBkmNode> {
    return new Promise((res, rej) => {
      chrome.bookmarks.move(id, target).then((node) => res(node));
    });
  }

  update(id: string, changes: chrome.bookmarks.BookmarkChangesArg): Promise<BrowserBkmNode> {
    // changes - title? and url?
    return chrome.bookmarks.update(id, changes);
  }

  createNode(createData: {
    title?: string;
    url?: string;
    parentId?: string;
    index?: number;
  }): Promise<BrowserBkmNode> {
    return chrome.bookmarks.create(createData);
  }

  getFullTree(): Promise<BrowserBkmNode[]> {
    return chrome.bookmarks.getTree().then((tree) => (tree && tree[0]?.children) || []);
  }
}

// Browser Events.

class ChromeEventsAPI implements BrowserEventsAPI {
  onRemove(callback: (id: string, removeInfo: chrome.bookmarks.BookmarkRemoveInfo) => void): void {
    chrome.bookmarks.onRemoved.addListener(callback);
  }
  onMove(callback: (id: string, moveInfo: chrome.bookmarks.BookmarkMoveInfo) => void): void {
    chrome.bookmarks.onMoved.addListener(callback);
  }
  onEdit(callback: (id: string, changeInfo: chrome.bookmarks.BookmarkChangeInfo) => void): void {
    chrome.bookmarks.onChanged.addListener(callback);
  }
  onCreate(callback: (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => void): void {
    chrome.bookmarks.onCreated.addListener(callback);
  }
  onChReorder(
    callback: (id: string, reorderInfo: chrome.bookmarks.BookmarkReorderInfo) => void
  ): void {
    chrome.bookmarks.onChildrenReordered.addListener(callback);
  }
  onImportEnd(callback: () => void): void {
    chrome.bookmarks.onImportEnded.addListener(callback);
  }
  onStorageChange(
    callback: (
      changes: {
        [key: string]: chrome.storage.StorageChange;
      },
      areaName: 'sync' | 'local' | 'managed' | 'session'
    ) => void
  ): void {
    chrome.storage.onChanged.addListener(callback);
  }
}

const getChromeAPIs = (): BrowserAPIs => {
  return { actions: new ChromeActionsAPI(), events: new ChromeEventsAPI() };
};

export { getChromeAPIs };
