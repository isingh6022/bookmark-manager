import {
  NodeType,
  BookmarkChildren,
  BookmarkTreeNode,
  BrowserBkmNode,
  BookmarkTreeDataNode
} from '@proj-types';
import * as CONST from '@proj-const';
import { OrderedMap } from '../../../utilities/utilities.js';

class BkmChildren implements BookmarkChildren {
  private _children = new OrderedMap<string, BookmarkTreeNode>();

  // prettier-ignore
  constructor(private _parentRef: BookmarkTreeNode,
      private _updateChDataArrRef: (arr: BookmarkTreeDataNode[]) => void,
      children: BookmarkTreeNode[] = []) {
    this.setChildren(children);
  }

  getChildren(): BookmarkTreeNode[] {
    return this._children.toArray();
  }
  setChildren(nodes: BookmarkTreeNode[] = []): void {
    this._children.resetToNewValues(nodes);
    this._updateChildrenDataArr();
  }

  mov(nodeOrId: BookmarkTreeNode | string, newIndex: number): void {
    this._children.setIndex(nodeOrId, newIndex);
    this._updateChildrenDataArr();
  }
  add(node: BookmarkTreeNode, index?: number | undefined): void {
    this._children.add(node, index);
    this._updateChildrenDataArr();
    node.parent = this._parentRef;
  }
  rmv(nodeOrId: BookmarkTreeNode | string): BookmarkTreeNode | null {
    let removed = this._children.del(nodeOrId);
    this._updateChildrenDataArr();
    removed && (removed.parent = null);

    return removed;
  }

  getOrderedIds(): string[] {
    return this.getChildren().map((child) => child.id);
  }
  setIdsOrder(idsOrder: string[]): void {
    let orderedChildren = <BookmarkTreeNode[]>(
      idsOrder.map((id) => this._children.getById(id)).filter((node) => node)
    );
    this._children.resetToNewValues(orderedChildren);
    this._updateChildrenDataArr();
  }

  get size(): number {
    return this._children.length;
  }

  private _updateChildrenDataArr(): void {
    this._updateChDataArrRef(this._children.mapChildrenInOrder((node) => node.dataTree));
  }
}

/**
 * Initializes the data stored in a node.
 */
// prettier-ignore
abstract class BkmTreeNodeInitializer {

  /**
   * NOTE: Following will become immutable as its returned as part of redux state.
   */
  private _dataTree: BookmarkTreeDataNode;
  get dataTree(): BookmarkTreeDataNode { return this._dataTree; }

  get type(): NodeType {    return this._dataTree.type; }
  get id(): string {        return this._dataTree.id; }
  get mapId(): string {     return this._dataTree.id; }
  get dateAdded(): number { return this._dataTree.dateAdded; }


  private _title_lower: string;
  private _url_lower: string;


  get title(): string {       return this._dataTree.title; }
  get title_lower(): string { return this._title_lower; }
  get url(): string {         return this._dataTree.url; }
  get url_lower(): string {   return this._url_lower; }


  get parentId(): string { return this._dataTree.parentId; }
  get index(): number {    return this._dataTree.index; }


  constructor(browserBkmNode: BrowserBkmNode, parent?: BookmarkTreeNode) {
    this._dataTree = {
      type      : browserBkmNode.url? NodeType.BKM: NodeType.FOL,
      id        : browserBkmNode.id,
      dateAdded : browserBkmNode.dateAdded ?? CONST.DEFAULT_DATE,

      title     : browserBkmNode.title,
      url       : browserBkmNode.url ?? '',

      index     : browserBkmNode.index ?? 0,
      parentId  : browserBkmNode.parentId ?? '',
      children  : [],

      selected  : false,
    }

    this._title_lower = browserBkmNode.title.toLowerCase();
    this._url_lower   = this._dataTree.url.toLowerCase();

    if (parent) {
      this._dataTree.parentId = parent.id;
    }
  }

  protected _updateTitleLower(title: string) {
    this._title_lower = title.toLowerCase();
  }
  setChildrenArrRef(ref: BookmarkTreeDataNode[]) {
    this._updateDataTree({ children: ref });
  }

  protected _updateDataTree(data: Partial<BookmarkTreeDataNode>) {
    this._dataTree = { ...this._dataTree, ...data };
    if (data.url) {
      this._url_lower = data.url.toLowerCase();
    }
    (data.title || data.title === '') && this._updateTitleLower(data.title);

    this._updateChildReferencesInParent();
  }
  protected abstract _updateChildReferencesInParent(): void;
}

// prettier-ignore
class BkmTreeNodeImpl extends BkmTreeNodeInitializer implements BookmarkTreeNode {
  private _childNodes: BkmChildren;
  get childNodes(): BookmarkChildren { return this._childNodes; }
  private _parentRef: BkmTreeNodeImpl | undefined;

  constructor(browserBkmNode: BrowserBkmNode, parentNode?: BkmTreeNodeImpl) {
    super(browserBkmNode, parentNode);
    this._parentRef = parentNode;

    this._childNodes = new BkmChildren(this, (arr: BookmarkTreeDataNode[]) =>
        this.setChildrenArrRef(arr));

    (browserBkmNode.children ?? []).length
        && this._childNodes.setChildren(
              browserBkmNode.children!.map((child) => new BkmTreeNodeImpl(child, this)));
  }

  protected _updateChildReferencesInParent(): void {
    if (!this._parentRef) return;

    let siblingArr = [...this._parentRef.dataTree.children],
      index = siblingArr.findIndex((node) => node.id === this.id);

    if (index !== -1) {
      siblingArr[index] = this.dataTree;
    }
    this._parentRef.setChildrenArrRef(siblingArr);
  }

  get children(): BookmarkTreeNode[] { return this.childNodes.getChildren(); }

  set parent(parentNode: BookmarkTreeNode | null) {
    if (!parentNode) {
      this._parentRef = undefined;
      this._updateDataTree({ parentId: '' });
      return;
    }
    this._updateDataTree({ parentId: parentNode.id });
    this._parentRef = parentNode as BkmTreeNodeImpl;
  }

  setIndex(index: number): void { this._updateDataTree({ index }); }

  edit(obj: { title?: string; url?: string }): void {
    let editObj: Partial<BookmarkTreeDataNode> = {};

    (obj.title || obj.title === '') && (editObj.title = obj.title);
    (obj.url || obj.url === '') && (editObj.url = obj.url);

    this._updateDataTree(editObj);
  }

  updateTitleLower(title: string): void {
    this._updateTitleLower(title);
  }

  public get selected(): boolean {
    return this.dataTree.selected;
  }
  public set selected(value: boolean) {
    this._updateDataTree({ selected: value });
  }
}

function BookmarkTreeNodeFactory(browserBkmNodenode: BrowserBkmNode): BookmarkTreeNode {
  return new BkmTreeNodeImpl(browserBkmNodenode);
}

export { BookmarkTreeNodeFactory };
