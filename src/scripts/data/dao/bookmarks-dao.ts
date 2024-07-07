import { DEFAULT_ROOT_NODE_TITLE } from '@proj-const';
// prettier-ignore
import {
  BrowserBkmNode, StorageDAO,
  BkmEventType, EventInfo, BkmEvent,
  RemovedEvent, MovedEvent, ChangedEvent, CreatedEvent,
  ChReordered, ImportEndEvent, BookmarkTreeNode
} from '@proj-types';

import {
  InvalidArgumentError,
  NotImplmentedError,
  FailedToLoadBookmarks,
  BaseSingleton
} from '../../utilities/utilities.js';
import { BROWSER } from '../browser/browser-api.js';

export class BookmarksDAO extends BaseSingleton implements StorageDAO<BrowserBkmNode[]> {
  static get instance(): BookmarksDAO {
    return BaseSingleton._getInstance(BookmarksDAO) || new BookmarksDAO();
  }

  load(): Promise<BrowserBkmNode[]> {
    return new Promise((res, rej) => {
      BROWSER.actions
        .getFullTree()
        .then((data: BrowserBkmNode[]) => {
          if (!data || !data.length) {
            throw new Error();
          } else {
            for (let node of data) {
              if (!node.title) {
                node.title = DEFAULT_ROOT_NODE_TITLE;
              }
            }
            res(data);
          }
        })
        .catch((err) => {
          throw new FailedToLoadBookmarks(BookmarksDAO.name);
        });
    });
  }
  save(data: BrowserBkmNode[]): void {
    throw new NotImplmentedError(BookmarksDAO.name, 'save');
  }

  listenBrowserEvents(listeners: {
    rmv: (event: RemovedEvent) => void;
    mov: (event: MovedEvent) => void;
    chg: (event: ChangedEvent) => void;
    add: (event: CreatedEvent) => void;
    ord: (event: ChReordered) => void;
    imp: (event: ImportEndEvent) => void;
  }): void {
    // rmv
    BROWSER.events.onRemove((id, removeInfo) => {
      listeners.rmv({ type: BkmEventType.RMV, payload: { removedNodeId: id, ...removeInfo } });
    });
    // mov
    BROWSER.events.onMove((id, moveInfo) => {
      listeners.mov({ type: BkmEventType.MOV, payload: { movedNodeId: id, ...moveInfo } });
    });
    // chg
    BROWSER.events.onEdit((id, changeInfo) => {
      listeners.chg({ type: BkmEventType.CHG, payload: { changedNodeId: id, ...changeInfo } });
    });
    // add
    BROWSER.events.onCreate((id, bookmark) => {
      listeners.add({ type: BkmEventType.ADD, payload: { ...bookmark } });
    });
    // ord
    BROWSER.events.onChReorder((id, reorderInfo) => {
      listeners.ord({
        type: BkmEventType.ORD,
        payload: { targetParentNodeId: id, ...reorderInfo }
      });
    });
    // imp
    BROWSER.events.onImportEnd(() => {
      listeners.imp({ type: BkmEventType.IMP, payload: null });
    });
  }
  dispatchBrowserEvent(event: BkmEvent): Promise<any> | null {
    switch (event.type) {
      case BkmEventType.RMV: {
        return BROWSER.actions.removeBkm((<RemovedEvent>event).payload.removedNodeId);
      }
      case BkmEventType.MOV: {
        let { movedNodeId, ...payload } = (<MovedEvent>event).payload;
        return BROWSER.actions.moveBk(movedNodeId, payload);
      }
      case BkmEventType.CHG: {
        let { changedNodeId, ...payload } = (<ChangedEvent>event).payload;
        return BROWSER.actions.update(changedNodeId, payload);
      }
      case BkmEventType.ADD: {
        return BROWSER.actions.createNode((<CreatedEvent>event).payload);
      }
      case BkmEventType.ORD: {
        throw new NotImplmentedError(BookmarksDAO.name, 'dispatchBrowserEvent:reorder');
      }
      case BkmEventType.IMP: {
        // Do nothing.
        throw new NotImplmentedError(BookmarksDAO.name, 'dispatchBrowserEvent:import');
      }
    }
    return null;
  }
}
