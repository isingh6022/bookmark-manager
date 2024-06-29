import { BookmarkTreeNode, BookmarkTreeDataNode } from '../../data/node.js';
import { IconData, IconObj } from '../../data/icons.js';
import { BookmarkSliceState } from './bkm-slice-types.js';
import { RetainedState } from './settings-slice-types.js';
import { TransientState } from './transient-slice-types.js';

interface ReadonlyCache<T> {
  getCurrentState(): T;
  initialized: boolean;
  isSynced: boolean;
  //   getSaveDataForSyncAndCommit(): Partial<STORAGE_DATA_OBJECT<any>>;
}

interface ReadonlyBkmCache extends ReadonlyCache<BookmarkSliceState> {
  getNode(id?: string): BookmarkTreeNode | undefined;
  hasNode(id: string): boolean;
  getRootNode(): BookmarkTreeNode;
  getAllNodes(id?: string): BookmarkTreeNode[];
  getAllBookmarks(id?: string): BookmarkTreeNode[];
  getAllFolders(id?: string): BookmarkTreeNode[];
  getAllChildren(id?: string | undefined): BookmarkTreeNode[];
  getParentChain(id: string): BookmarkTreeNode[];
  get defaultNode(): BookmarkTreeNode;
  get baseNodes(): BookmarkTreeDataNode[];
}

interface ReadonlySettingsCache extends ReadonlyCache<RetainedState> {}

interface ReadonlyTransientCache extends ReadonlyCache<TransientState> {}

interface ReadonlyIconCache extends ReadonlyCache<IconObj> {
  getIco(id: string): IconData | undefined;
}

export type {
  ReadonlyCache,
  ReadonlyBkmCache,
  ReadonlySettingsCache,
  ReadonlyTransientCache,
  ReadonlyIconCache
};
