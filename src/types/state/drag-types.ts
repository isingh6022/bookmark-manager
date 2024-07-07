import { DragDropClassCSS } from '@proj-const';
import { BookmarkTreeDataNode, NodeType, Pin } from '../data/node.js';

// prettier-ignore
enum DragstartType { FOL, BKM, PIN, POP }
// prettier-ignore
enum DragoverOrDropType { FOL, BKM, PIN, PIN_CONTAINER, NOD_CONTAINER, NUL }

interface DropZone {
  topBot: DragDropClassCSS.TOP | DragDropClassCSS.BOT | null;
  lftRgt: DragDropClassCSS.LFT | DragDropClassCSS.RGT | null;
  lftHlf: DragDropClassCSS.LFT | DragDropClassCSS.RGT;
  topHlf: DragDropClassCSS.TOP | DragDropClassCSS.BOT;
  middle: DragDropClassCSS.MID | null;
}

interface DraggableCallbacks {
  /**
   * To be used overwrite the callbacks for a given id.
   */
  readonly callbackId: string;

  /**
   * Callback used to fetch a possible dragstart target for a given mousedown event.
   * If the callback returns null, the dragstart event will not be triggered.
   * The first non-null value from any callback will be used as the dragstart target and
   * only its corresponding onDragstart and onDragend callbacks will be called.
   *
   * @param e The mouse event callback which will be received by this callback.
   * @returns The target element which will be used as the dragstart target.
   */
  getDragstartTarget: (e: MouseEvent) => HTMLElement | null;
  onDragstart: (e: MouseEvent, dragstartTarget: HTMLElement) => void;
  onDragend: (e: MouseEvent, dragstartTarget: HTMLElement) => void;
}

interface DroppableCallbacks {
  /**
   * To be used overwrite the callbacks for a given id.
   */
  readonly callbackId: string;

  /**
   * Callback used to fetch a possible drop target for a given mousedown event.
   * If the callback returns null, this set of droppable callbacks will be ignored.
   * The first non-null value from any callback will be used as the drop target and
   * only its corresponding onDragover and onDragend callbacks will be called.
   *
   * @param e The mouse event callback which will be received by this callback.
   * @returns The target element which will be used as the dragstart target.
   */
  getDropTarget: (e: MouseEvent, dragstartTarget: HTMLElement) => HTMLElement | null;
  onDragover: (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dragOverTarget: HTMLElement,
    dropZone: DropZone
  ) => void;
  onDropover: (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dropTarget: HTMLElement,
    dropZone: DropZone
  ) => void;
  scrollElement: null | HTMLElement | ((dragOverTarget: HTMLElement) => HTMLElement | null);
}

interface DragstartInfo {
  dragstartNode: string;
  dragType: DragstartType;
}

interface DropInfo {
  readonly dropTarget: string | null;
  readonly dropType: DragoverOrDropType;
  readonly dropZone: DropZone;
}

interface Scroller {
  scrollEl: HTMLElement | (() => HTMLElement | null) | Window | null;
  startMovingUpwards(): void;
  startMovingDownwards(): void;
  stopMoving(): void;
}

// prettier-ignore
export {
  DragstartType, DragoverOrDropType,
  DraggableCallbacks, DroppableCallbacks,
  DropZone, DragstartInfo, DropInfo,
  Scroller
};
