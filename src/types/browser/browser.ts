import { STORAGE_DATA_OBJECT } from './storage.js';
import { BookmarkTreeNode, BrowserBkmNode } from '../data/types-data.js';

enum BROWSER_TYPE {
  Mock,
  Chrome
}

type BrowserRemoveInfo = chrome.bookmarks.BookmarkRemoveInfo;
type BrowserMoveInfo = chrome.bookmarks.BookmarkMoveInfo;
type BrowserChangeInfo = chrome.bookmarks.BookmarkChangeInfo;
type BrowserReorderInfo = chrome.bookmarks.BookmarkReorderInfo;

interface BrowserActionsAPI {
  getBkmIconSrc(url?: string): string;

  store(keyValPairs: Partial<STORAGE_DATA_OBJECT>): Promise<void>;
  getLocalStorage(keys: string | string[]): Promise<{
    [key: string]: any;
  }>;

  removeBkm(id: string): Promise<void>;
  removeTree(id: string): Promise<void>;

  moveBk(id: string, target: { parentId: string; index?: number }): Promise<BrowserBkmNode>;

  update(
    id: string,
    changes: {
      title?: string;
      url?: string;
    }
  ): Promise<BrowserBkmNode>;

  createNode(createData: {
    title?: string;
    url?: string;
    parentId?: string;
    index?: number;
  }): Promise<BrowserBkmNode>;

  getFullTree(): Promise<BrowserBkmNode[]>;
}

interface BrowserEventsAPI {
  onRemove(callback: (id: string, removeInfo: BrowserRemoveInfo) => void): void;
  onMove(callback: (id: string, moveInfo: BrowserMoveInfo) => void): void;
  onEdit(callback: (id: string, changeInfo: BrowserChangeInfo) => void): void;
  onCreate(callback: (id: string, bookmark: BrowserBkmNode) => void): void;
  onChReorder(callback: (id: string, reorderInfo: BrowserReorderInfo) => void): void;
  onImportEnd(callback: () => void): void;
  onStorageChange(
    callback: (
      changes: {
        [key: string]: chrome.storage.StorageChange;
      },
      areaName: 'sync' | 'local' | 'managed' | 'session'
    ) => void
  ): void;
}

interface BrowserEvent<T> {
  addListener: (callback: (id: string, param: T) => void) => void;
}

interface BrowserAPIs {
  actions: BrowserActionsAPI;
  events: BrowserEventsAPI;
}

export { BrowserActionsAPI, BrowserEventsAPI, BrowserAPIs, BrowserEvent, BROWSER_TYPE };
