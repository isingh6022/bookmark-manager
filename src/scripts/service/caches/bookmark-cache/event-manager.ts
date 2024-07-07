// prettier-ignore
import {
  BookmarkTreeNode, BrowserBkmNode,

  BkmEvent,
  ChReordered, ChangedEvent, CreatedEvent,
  MovedEvent, RemovedEvent, BookmarkSliceState
} from '@proj-types';

import { BookmarkTreeNodeFactory } from './bkm-node-impl.js';
import { BaseCache } from '../baseCache.js';

export abstract class EventManager extends BaseCache<BookmarkSliceState> {
  // @ts-ignore
  // Initialization error - Ignored to use helper method for initialization in constructor.
  protected _rootNode: BookmarkTreeNode;
  protected map = new Map<string, BookmarkTreeNode>();

  private _executedEventStack: BkmEvent[] = [];

  constructor(rootNode: BrowserBkmNode) {
    super();
    this.setRootNode(rootNode);
  }

  getRootNode(): BookmarkTreeNode {
    return this._rootNode;
  }
  setRootNode(rootNode: BrowserBkmNode): void {
    this._rootNode = BookmarkTreeNodeFactory(rootNode);
    if (this.getNode(this._rootNode.parentId)) {
      throw 'Somehow found the parent of root node.';
    }
    this.map.clear();
    this._getAllNodeInTree(this._rootNode).forEach((node) => this.map.set(node.id, node));
  }
  abstract getParentChain(id: string): BookmarkTreeNode[];

  protected _getAllNodeInTree(bkmNode: BookmarkTreeNode): BookmarkTreeNode[] {
    let arr = [bkmNode];

    for (let child of bkmNode.children) {
      !child.children.length ? arr.push(child) : arr.push(...this._getAllNodeInTree(child));
    }

    return arr;
  }

  getNode(id?: string): BookmarkTreeNode | undefined {
    return id ? this.map.get(id) : undefined;
  }
  hasNode(id: string): boolean {
    return this.map.has(id);
  }

  protected _popExecutedEvent(): BkmEvent | undefined {
    return this._executedEventStack.pop();
  }
  protected _pushExecutedEvent(event: BkmEvent, clearUndoStack = false) {
    this._executedEventStack.push(event);
  }

  protected _executeRemoveEvent(event: RemovedEvent): boolean {
    let parent = this.getNode(event.payload.parentId);

    if (parent) {
      parent.childNodes.rmv(event.payload.node.id);
      return true;
    }
    return false;
  }

  protected _executeMoveEvent(event: MovedEvent): boolean {
    let newParent = this.getNode(event.payload.parentId),
      oldParent = this.getNode(event.payload.oldParentId),
      newParentParentChain = this.getParentChain(event.payload.parentId);

    if (
      newParent &&
      oldParent &&
      newParentParentChain.findIndex((node) => node.id === event.payload.movedNodeId) === -1
    ) {
      let moved = oldParent.childNodes.rmv(event.payload.movedNodeId);
      if (moved) {
        newParent.childNodes.add(moved, event.payload.index);
        return true;
      }
    }
    return false;
  }

  protected _executeEditEvent(event: ChangedEvent): boolean {
    let node = this.getNode(event.payload.changedNodeId);
    if (node) {
      event.payload.oldInfo = { title: node.title, url: node.url };
      node && node.edit({ title: event.payload.title, url: event.payload.url });
      return true;
    }
    return false;
  }

  protected _executeCreateEvent(event: CreatedEvent): boolean {
    let newNode = BookmarkTreeNodeFactory(event.payload),
      parent = this.getNode(event.payload.parentId);

    if (parent) {
      parent.childNodes.add(newNode, newNode.index);
      return true;
    }
    return false;
  }

  protected _executeChReorderedEvent(event: ChReordered): boolean {
    let node = this.getNode(event.payload.targetParentNodeId);

    if (node) {
      let prevOrder = node.childNodes.getOrderedIds();
      node.childNodes.setIdsOrder(event.payload.childIds);
      event.payload.prevOrder = prevOrder;

      return true;
    }
    return false;
  }
}
