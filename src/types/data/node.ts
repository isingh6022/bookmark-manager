// prettier-ignore
enum NodeType { BKM, FOL }

/**
 * Type of node used by browser.
 */
type BrowserBkmNode = chrome.bookmarks.BookmarkTreeNode;

/**
 * Data is maintained in a non class object for use in redux.
 */
interface BookmarkTreeDataNode {
  type: NodeType;
  id: string;
  dateAdded: number;

  title: string;
  url: string;

  parentId: string;
  index: number;
  children: BookmarkTreeDataNode[];
  selected: boolean;

  isIcon: boolean;
}

/**
 * Type of node maintained in the cache.
 */
interface BookmarkTreeNode extends BrowserBkmNode {
  readonly dataTree: BookmarkTreeDataNode;

  readonly type: NodeType;
  readonly id: string;
  readonly mapId: string;
  readonly dateAdded: number;
  //   dateGroupModified: number;

  readonly title: string;
  /**
   * This property is useful for search.
   * Once the icons are loaded, this param is updated and then is always
   * maintained within the node. So, search does not require a separate
   * instance of icons manager.
   */
  readonly title_lower: string;
  readonly url: string;
  readonly url_lower: string;

  /**
   * Used to update nodes with title_lower values once the data is loaded
   * from the icons.
   *
   * @param title title of the node from icons data
   */
  updateTitleLower(title: string): void;

  readonly index: number;
  readonly parentId: string;
  readonly childNodes: BookmarkChildren;
  readonly children: BookmarkTreeNode[];

  set parent(parentNodeOrId: BookmarkTreeNode | null);
  edit(obj: { title?: string; url?: string }): void;

  /**
   * Should be called only by an implementation of BookmarkChildren.
   * @param i The new index value
   */
  setIndex(i: number): void;

  selected: boolean;

  isIcon: boolean;
}

interface BookmarkChildren {
  getChildren(): BookmarkTreeNode[];
  setChildren(nodes: BookmarkTreeNode[]): void;

  add(node: BookmarkTreeNode, index?: number): void;
  mov(node: BookmarkTreeNode, newIndex: number): void;
  rmv(id: string): BookmarkTreeNode | null;

  getOrderedIds(): string[];
  setIdsOrder(idsOrder: string[]): void;

  readonly size: number;
}

interface Pin {
  id: string;
  title: string;
  removable: boolean;
}

export type { BookmarkChildren, BookmarkTreeNode, BookmarkTreeDataNode, BrowserBkmNode, Pin };
export { NodeType };
