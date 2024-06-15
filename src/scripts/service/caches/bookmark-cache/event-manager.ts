// prettier-ignore
import {
  BookmarkTreeNode, BrowserBkmNode,

  BkmEvent,
  ChReordered, ChangedEvent, CreatedEvent,
  MovedEvent, RemovedEvent, BookmarkSliceState,
  BkmEventType
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
  protected _pushExecutedEvent(event: BkmEvent, clearUndoStack = false): BkmEvent {
    this._executedEventStack.push(event);
    return event;
  }

  /**
   * Maintained to track which events were sent to browser after optimistic updates and
   * which ones are sent from the browser itself.
   */
  private _dispatchedEventsSet = new Set<string>();
  private _getBrowserEventSignature(event: BkmEvent): string {
    switch (event.type) {
      case BkmEventType.RMV: {
        let rmv = (<RemovedEvent>event).payload;
        return `${event.type}-${rmv.node.id}`;
      }
      case BkmEventType.MOV: {
        let mov = (<MovedEvent>event).payload;
        return `${event.type}-${mov.movedNodeId}-${mov.parentId}-${mov.index}-${mov.oldParentId}-${mov.oldIndex}`;
      }
      case BkmEventType.CHG: {
        let chg = (<ChangedEvent>event).payload,
          node = this.getNode(chg.changedNodeId);

        return node
          ? `${event.type}-${chg.changedNodeId}-${chg.title || node.title}-${
              chg.url || node.url || ''
            }`
          : '';
      }
      case BkmEventType.ADD: {
        let add = (<CreatedEvent>event).payload;
        return `${event.type}-${add.parentId}-${add.title}-${add.url}-${add.index}`;
      }
      case BkmEventType.ORD: {
        let ord = (<ChReordered>event).payload;
        return `${event.type}-${ord.targetParentNodeId}`;
      }
      case BkmEventType.IMP: {
        return `${event.type}-`;
      }
      default: {
        return '';
      }
    }
  }

  /**
   * Executes most of the events directly onto the cache and then sends and optimistic
   * update to browser.
   *
   * @param eventClone
   * @param executeOptimistically Some events can't be executed directly,
   * like bookmark / folder creation events. Browser has to decide the id first.
   * @param updateFromBrowser Whether the update was sent from the browser.
   */
  executeEvent(event: BkmEvent, executeOptimistically = true, updateFromBrowser = false): void {
    if (executeOptimistically) {
      let eventExecuted = false,
        eventClone = this._cloneEvent(event);

      switch (eventClone.type) {
        case BkmEventType.RMV: {
          let rmvEvent = <RemovedEvent>eventClone;
          eventExecuted = this._executeRemoveEvent(rmvEvent);
          break;
        }
        case BkmEventType.MOV: {
          eventExecuted = this._executeMoveEvent(<MovedEvent>eventClone);
          break;
        }
        case BkmEventType.CHG: {
          let changeEvent = <ChangedEvent>eventClone;
          eventExecuted = this._executeEditEvent(changeEvent);
          break;
        }
        case BkmEventType.ADD: {
          eventExecuted = this._executeCreateEvent(<CreatedEvent>eventClone);
          break;
        }
        case BkmEventType.ORD: {
          eventExecuted = this._executeChReorderedEvent(<ChReordered>eventClone);
          break;
        }
        case BkmEventType.IMP: {
          break;
        }
      }

      if (eventExecuted) {
        this._afterBrowserEvent(this._pushExecutedEvent(this._cloneEvent(event)));
      }
    }

    if (!updateFromBrowser) {
      this._dispatchBrowserEvent(event);
      this._dispatchedEventsSet.add(this._getBrowserEventSignature(event));
    } else {
      this._onBrowserUpdate();
    }
  }
  private _cloneEvent(event: BkmEvent): BkmEvent {
    return { type: event.type, payload: { ...(<any>event.payload || null) } };
  }
  protected abstract _afterBrowserEvent(event: BkmEvent): void;
  protected abstract _dispatchBrowserEvent(event: BkmEvent): void;

  /**
   * It may be noted that the order of the events is crucial. Thus its assumed that
   * the behavior is analogus to how synchronous code would behave.
   *
   * @param event The event object generated from the event data received from browser.
   */
  protected _executeEventFromBrowser(event: BkmEvent) {
    if (event.type === BkmEventType.MOV) {
      // Behavior observed in chrome...
      let movEvent = <MovedEvent>event;
      if (
        movEvent.payload.oldParentId === movEvent.payload.parentId &&
        movEvent.payload.index > movEvent.payload.oldIndex
      ) {
        typeof movEvent.payload.index === 'number' && movEvent.payload.index++;
      }
    }
    let signature = this._getBrowserEventSignature(event),
      executeOptimistically = !this._dispatchedEventsSet.has(signature);

    this._dispatchedEventsSet.delete(signature);

    this.executeEvent(event, executeOptimistically, true);
  }
  private _onBrowserUpdate: Function = () => {};
  onBrowserUpdate(cb: Function) {
    this._onBrowserUpdate = cb;
  }

  private _executeRemoveEvent(event: RemovedEvent): boolean {
    let parent = this.getNode(event.payload.parentId);

    if (parent) {
      parent.childNodes.rmv(event.payload.node.id);
      return true;
    }
    return false;
  }

  private _executeMoveEvent(event: MovedEvent): boolean {
    let newParent = this.getNode(event.payload.parentId),
      oldParent = this.getNode(event.payload.oldParentId),
      newParentParentChain = this.getParentChain(event.payload.parentId);

    event.payload.parentId === event.payload.oldParentId &&
      event.payload.oldIndex < event.payload.index &&
      event.payload.index--;

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

  private _executeEditEvent(event: ChangedEvent): boolean {
    let node = this.getNode(event.payload.changedNodeId);
    if (node) {
      event.payload.oldInfo = { title: node.title, url: node.url };
      node && node.edit({ title: event.payload.title, url: event.payload.url });
      return true;
    }
    return false;
  }

  private _executeCreateEvent(event: CreatedEvent): boolean {
    let newNode = BookmarkTreeNodeFactory(event.payload),
      parent = this.getNode(event.payload.parentId);

    if (parent) {
      parent.childNodes.add(newNode, newNode.index);
      return true;
    }
    return false;
  }

  private _executeChReorderedEvent(event: ChReordered): boolean {
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
