import { BookmarkTreeDataNode, BookmarkTreeNode } from './node.js';

interface NodeScoreData<NodeType extends BookmarkTreeDataNode = BookmarkTreeDataNode> {
  node: NodeType;
  // fulLtag = 0;
  fulLfol: number;
  fulLnam: number;
  fulLurl: number;
  // parTtag : number;
  parTfol: number;
  parTnam: number;
  parTurl: number;
  get score(): number;
}

type SearchStats = {
  nBkm: number;
  nFol: number;
  nFolTotal: number;
  nBkmTotal: number;
  duration: number;
};

interface SearchData {
  get folId(): string;
  get query(): string;
  get nodes(): BookmarkTreeDataNode[];

  get result(): NodeScoreData[];
  get stats(): SearchStats;
}

interface Search extends SearchData {
  get nodes(): BookmarkTreeNode[];

  execute(): boolean;
  reset(): void;

  get result(): NodeScoreData<BookmarkTreeDataNode>[];
  get stats(): SearchStats;
  isSameAs(search: { folId: string; query: string }): boolean;
}

interface SearchParams {
  folId: string;
  query: string;
  nodes: BookmarkTreeNode[];
  querySeparator: string;
}

export type { NodeScoreData, SearchStats, Search, SearchData, SearchParams };
