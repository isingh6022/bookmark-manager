import { DragDropClassCSS, MinorElementsRefCSS } from '@proj-const';
import { Util } from '../utilities/util/util.js';
import { DraggableCallbacks } from '@proj-types';

export const folPinDraggableConfig: (
  onDragstart: (dragstartTarget: HTMLElement) => void,
  dragEndCB: () => void
) => DraggableCallbacks = (onDragstart, dragEndCB) => ({
  callbackId: 'pin-folders-draggable',
  getDragstartTarget: (e: MouseEvent): HTMLElement | null => {
    let el =
      e.target instanceof HTMLElement ? Util.dragDrop.getPinnedFolderElement(e.target) : null;
    let isFixedPin = el && el.classList.contains(MinorElementsRefCSS.PIN_FOL_NON_RMV);

    return isFixedPin ? null : el;
  },
  onDragstart: (e: MouseEvent, dragstartTarget: HTMLElement): void => {
    onDragstart(dragstartTarget);
    dragstartTarget.classList.add(DragDropClassCSS.DRAGGING);
  },
  onDragend: (): void => {
    Util.dragDrop.cleanupDragDropClasses();
    setTimeout(() => dragEndCB());
  }
});

export const bkmOrFolDraggableConfig: (
  onDragstart: (dragstartTarget: HTMLElement) => void,
  dragEndCB: () => void
) => DraggableCallbacks = (onDragstart, dragEndCB) => ({
  callbackId: 'node-bkm-fol-draggable',
  getDragstartTarget: function (e: MouseEvent): HTMLElement | null {
    return e.target instanceof HTMLElement && Util.dragDrop.getBkmPageContainerParent(e.target)
      ? Util.dragDrop.getBookmarkElement(e.target) ?? Util.dragDrop.getFolderElement(e.target)
      : null;
  },
  onDragstart: function (e: MouseEvent, dragstartTarget: HTMLElement): void {
    onDragstart(dragstartTarget);
    dragstartTarget.classList.add(DragDropClassCSS.DRAGGING);
  },
  onDragend: function (): void {
    Util.dragDrop.cleanupDragDropClasses();
    setTimeout(() => dragEndCB());
  }
});

export const popupDraggableConfig: (
  onDragstart: (e: MouseEvent) => void,
  dragEndCB: () => void
) => DraggableCallbacks = (onDragstart, dragEndCB) => ({
  callbackId: 'popup-draggable',
  getDragstartTarget: function (e: MouseEvent): HTMLElement | null {
    return e.target instanceof HTMLElement ? Util.dragDrop.getPopupTitle(e.target) : null;
  },
  onDragstart: function (e: MouseEvent, dragstartTarget: HTMLElement): void {
    dragstartTarget.classList.add(DragDropClassCSS.DRAGGING);
    onDragstart(e);
  },
  onDragend: function (e: MouseEvent): void {
    Util.dragDrop.cleanupDragDropClasses();
    setTimeout(() => dragEndCB());
  }
});
