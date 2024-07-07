import { DragDropClassCSS, LayoutRefCSS } from '@proj-const';
import { Util } from '../../utilities/util/util.js';
import { DropZone, DroppableCallbacks } from '@proj-types';

export const folPinDroppableConfig: (
  onDrop: (dragstartTarget: HTMLElement, dropTarget: HTMLElement, dropZone: DropZone) => void
) => DroppableCallbacks = (onDrop) => ({
  callbackId: 'pin-folders-droppable',
  getDropTarget: (e: MouseEvent, dragstartTarget: HTMLElement): HTMLElement | null => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) {
      return null;
    }

    return Util.dragDrop.getPinnedFolderElement(el);
  },
  onDragover: (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dragOverTarget: HTMLElement,
    dropZone: DropZone
  ): void => {
    const draggingNode = Util.dragDrop.isFolderOrBkmElement(dragstartTarget),
      overFixPin = Util.dragDrop.isFixedPin(dragOverTarget);

    Util.dragDrop.cleanupDragDropClasses(false);
    dragOverTarget.classList.add(DragDropClassCSS.OVER);

    let draggingTopOrBot = false;
    if (draggingNode) {
      if (overFixPin) {
        dragOverTarget.classList.add(DragDropClassCSS.MID);
      } else {
        if (dropZone.topBot !== null) {
          dragOverTarget.classList.add(dropZone.topBot);
          draggingTopOrBot = true;
        } else {
          dragOverTarget.classList.add(DragDropClassCSS.MID);
        }
      }
    } else if (!overFixPin) {
      dragOverTarget.classList.add(dropZone.topHlf);
      draggingTopOrBot = true;
    }

    // Adding classes to elements above / below.
    draggingTopOrBot &&
      Util.nodeIndices.addTopBotClassToAdjacentEl(dragOverTarget, dropZone.topHlf);
  },
  onDropover: (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dropTarget: HTMLElement,
    dropZone: DropZone
  ): void => {
    onDrop(dragstartTarget, dropTarget, dropZone);
  },
  scrollElement: () => document.getElementById(LayoutRefCSS.SIDEBAR_LT_ID) || null
});
