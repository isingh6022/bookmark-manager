import { DraggableCallbacks, DropZone, DroppableCallbacks, Scroller } from '@proj-types';
import { Util } from '../utilities/util/util.js';
import { BaseSingleton } from '../utilities/utilities.js';
import { DRAG_START_THRESHOLD_PIX, SCROLL } from '@proj-const';
import { ScrollerImpl } from '../utilities/scroller.js';

class CallbackList<T extends { callbackId: string }> {
  private _callbacks: T[] = [];

  private _getCallbackIndex(callbackId: string): number {
    return this._callbacks.findIndex((cb) => cb.callbackId === callbackId);
  }
  add(callbacks: T) {
    let index = this._getCallbackIndex(callbacks.callbackId);
    if (index !== -1) {
      this._callbacks[index] = callbacks;
      return;
    }

    this._callbacks.push(callbacks);
  }

  rmv(callbackId: string) {
    let index = this._getCallbackIndex(callbackId);
    if (index !== -1) this._callbacks.splice(index, 1);
  }

  getAll() {
    return this._callbacks;
  }
}

class DragDropHelper {
  private static _DRAGGING: boolean = false;
  private static _DRAG_EL: HTMLElement | null = null;
  private static _scroller: Scroller = new ScrollerImpl(SCROLL.REM_PER_SEC, SCROLL.STEP_SIZE_REM);

  static get dragging() {
    return DragDropHelper._DRAGGING;
  }
  static getDragEl() {
    return DragDropHelper.dragging ? DragDropHelper._DRAG_EL : null;
  }

  static draggableCallbacks = new CallbackList<DraggableCallbacks>();
  static droppableCallbacks = new CallbackList<DroppableCallbacks>();

  static beforeEachDragover: Function = () => {};
  static afterEachNoMatchDragover: Function = () => {};

  static addDragDropListeners() {
    window.addEventListener('mousedown', DragDropHelper._mousedownBeforeDrag);
    window.addEventListener('mouseup', DragDropHelper._cleanupAndDrop);
  }
  static setDragstartThreshold(val: number) {
    DragDropHelper._dragstartThreshold = val;
  }

  private static _startEvent: MouseEvent | null = null;

  private static _dragstartThreshold: number = DRAG_START_THRESHOLD_PIX;
  private static _activeDraggableCallback: DraggableCallbacks | null = null;

  // prettier-ignore
  private static _DRAG_LOC: {
    x: null | number; y: null | number; mouse: 'up' | 'down';
  } = {
    x: null, y: null, mouse: 'up'
  };
  private static _setDragLoc(x: number | null, y: number | null, mouse: 'up' | 'down') {
    DragDropHelper._DRAG_LOC.x = x;
    DragDropHelper._DRAG_LOC.y = y;
    DragDropHelper._DRAG_LOC.mouse = mouse;
  }
  private static _checkDragThreshold(e: MouseEvent, initLoc: typeof DragDropHelper._DRAG_LOC) {
    return initLoc.x === null || initLoc.y === null
      ? false
      : Math.abs(e.pageX - initLoc.x) + Math.abs(e.pageY - initLoc.y) >
          DragDropHelper._dragstartThreshold;
  }

  private static _eatOneClick(e: MouseEvent) {
    e.preventDefault();
    window.removeEventListener('click', DragDropHelper._eatOneClick);
  }

  private static _mousedownBeforeDrag(e: MouseEvent) {
    let draggableElement: HTMLElement | null = null;

    // e.button === 0 for left click.
    if (!e.button) {
      for (let cb of DragDropHelper.draggableCallbacks.getAll()) {
        if ((draggableElement = cb.getDragstartTarget(e))) {
          e.preventDefault();

          if (document.activeElement !== draggableElement) {
            document.activeElement instanceof HTMLElement && document.activeElement.blur();
            draggableElement.focus();
          }

          DragDropHelper._setDragLoc(e.pageX, e.pageY, 'down');
          DragDropHelper._DRAG_EL = draggableElement;
          DragDropHelper._activeDraggableCallback = cb;
          DragDropHelper._startEvent = e;

          window.addEventListener('mousemove', DragDropHelper._mousemoveAfterMouseDownBeforeDrag);
          break;
        }
      }
    }
  }

  private static _mousemoveAfterMouseDownBeforeDrag(e: MouseEvent) {
    if (DragDropHelper._checkDragThreshold(e, DragDropHelper._DRAG_LOC)) {
      window.removeEventListener('mousemove', DragDropHelper._mousemoveAfterMouseDownBeforeDrag);
      window.addEventListener('mousemove', DragDropHelper._mousemoveWhileDragging);
      window.addEventListener('click', DragDropHelper._eatOneClick);

      DragDropHelper._DRAGGING = true;
      DragDropHelper._activeDraggableCallback?.onDragstart(
        DragDropHelper._startEvent!,
        DragDropHelper._DRAG_EL!
      );
    }
  }

  private static _mousemoveWhileDragging(e: MouseEvent) {
    let draggedElement = DragDropHelper._DRAG_EL!,
      dropTarget: HTMLElement | null = null,
      dropZone: DropZone | null = null,
      scrollEl: HTMLElement | null = null,
      configMatched = false,
      ratio: number;
    e.preventDefault();
    DragDropHelper.beforeEachDragover();

    for (let cb of DragDropHelper.droppableCallbacks.getAll()) {
      dropTarget = cb.getDropTarget(e, draggedElement);
      if (dropTarget) {
        dropZone = Util.dragDrop.getDragZone(e, dropTarget);

        if (dropZone) {
          // This implies that cursor is inside the dropTarget.
          cb.onDragover(e, draggedElement, dropTarget, dropZone);

          scrollEl =
            typeof cb.scrollElement === 'function'
              ? cb.scrollElement(dropTarget)
              : cb.scrollElement;
          if (scrollEl) {
            ratio = e.clientY / window.innerHeight;

            if (ratio < SCROLL.TOP_LIM_REM || ratio > SCROLL.BOT_LIM_REM) {
              DragDropHelper._scroller.scrollEl = scrollEl;

              ratio > SCROLL.BOT_LIM_REM
                ? DragDropHelper._scroller.startMovingDownwards()
                : DragDropHelper._scroller.startMovingUpwards();
            } else {
              DragDropHelper._scroller.stopMoving();
            }
          }
          configMatched = true;
          break;
        }
      }
    }

    !configMatched && DragDropHelper.afterEachNoMatchDragover();
  }

  private static _cleanupAndDrop(e: MouseEvent) {
    window.removeEventListener('mousemove', DragDropHelper._mousemoveAfterMouseDownBeforeDrag);
    window.removeEventListener('mousemove', DragDropHelper._mousemoveWhileDragging);
    DragDropHelper._scroller.stopMoving();

    if (DragDropHelper.dragging) {
      let draggedElement = DragDropHelper._DRAG_EL!,
        dropTarget: HTMLElement | null = null;
      e.preventDefault();

      for (let cb of DragDropHelper.droppableCallbacks.getAll()) {
        if ((dropTarget = cb.getDropTarget(e, draggedElement))) {
          let currDragZone = Util.dragDrop.getDragZone(e, dropTarget);
          currDragZone && cb.onDropover(e, draggedElement, dropTarget, currDragZone);
          break;
        }
      }

      DragDropHelper._activeDraggableCallback &&
        DragDropHelper._activeDraggableCallback.onDragend(e, draggedElement);
    }

    DragDropHelper._DRAG_EL = null;
    DragDropHelper._activeDraggableCallback = null;
    DragDropHelper._DRAGGING = false;
    DragDropHelper._setDragLoc(null, null, 'up');
  }
}

export class DragDropManager extends BaseSingleton {
  static get instance(): DragDropManager {
    return BaseSingleton._getInstance(DragDropManager) || new DragDropManager();
  }
  constructor() {
    super();
    DragDropHelper.addDragDropListeners();
  }

  static get dragging() {
    return DragDropHelper.dragging;
  }

  static get dragEl() {
    return DragDropHelper.getDragEl();
  }

  setDragstartThreshold(thresholdInPixels: number) {
    DragDropHelper.setDragstartThreshold(thresholdInPixels);
  }

  addDraggableCallbacks(callbacks: DraggableCallbacks) {
    DragDropHelper.draggableCallbacks.add(callbacks);
  }
  removeDraggableCallbacks(callbackId: string) {
    DragDropHelper.draggableCallbacks.rmv(callbackId);
  }

  addDroppableCallbacks(callbacks: DroppableCallbacks) {
    DragDropHelper.droppableCallbacks.add(callbacks);
  }
  removeDroppableCallbacks(callbackId: string) {
    DragDropHelper.droppableCallbacks.rmv(callbackId);
  }

  beforeEachDragover(callback: Function) {
    if (typeof callback === 'function') {
      DragDropHelper.beforeEachDragover = callback;
    }
  }
  afterEachNoMatchDragover(callback: Function) {
    if (typeof callback === 'function') {
      DragDropHelper.afterEachNoMatchDragover = callback;
    }
  }
}
