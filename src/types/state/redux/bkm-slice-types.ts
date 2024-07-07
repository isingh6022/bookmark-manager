import { SearchData } from '../../data/search.js';
import { BookmarkTreeDataNode } from '../../data/node.js';

interface BookmarkSliceState {
  baseNodes: BookmarkTreeDataNode[];
  currNode: BookmarkTreeDataNode;
  currNodeParentChain: BookmarkTreeDataNode[];

  showSearch?: boolean;
  searchData?: SearchData;

  lastSelectedId?: string;
}

export type { BookmarkSliceState };
