// remove | move | change/edit | create/add | childern reorder | import end
enum BkmEventType { RMV, MOV, CHG, ADD, ORD, IMP }

// interface EventIdInfo {}

interface RemoveInfo  extends chrome.bookmarks.BookmarkRemoveInfo { removedNodeId: string; }
interface MoveInfo    extends chrome.bookmarks.BookmarkMoveInfo { movedNodeId: string; }
interface ChangeInfo  extends chrome.bookmarks.BookmarkChangeInfo { changedNodeId: string; }
interface NodeInfo    extends chrome.bookmarks.BookmarkTreeNode {}
interface ReorderInfo extends chrome.bookmarks.BookmarkReorderInfo { targetParentNodeId: string; }

type EventInfo = RemoveInfo | MoveInfo | ChangeInfo | NodeInfo | ReorderInfo | null;


interface BkmEvent { type: BkmEventType; payload: EventInfo }

interface RemovedEvent   extends BkmEvent { type: BkmEventType.RMV; payload: RemoveInfo; }
interface MovedEvent     extends BkmEvent { type: BkmEventType.MOV; payload: MoveInfo; }
interface ChangedEvent   extends BkmEvent { type: BkmEventType.CHG;
    payload: ChangeInfo &  { oldInfo?: {title: string; url?: string}; }; }
interface CreatedEvent   extends BkmEvent { type: BkmEventType.ADD; payload: NodeInfo; }
interface ChReordered    extends BkmEvent { type: BkmEventType.ORD;
    payload: ReorderInfo & { prevOrder?: string[]; }; }
interface ImportEndEvent extends BkmEvent { type: BkmEventType.IMP; payload: null; }

export type {
  EventInfo, BkmEvent, 
  RemovedEvent, MovedEvent, ChangedEvent,
  CreatedEvent, ChReordered, ImportEndEvent
};

export { BkmEventType };
