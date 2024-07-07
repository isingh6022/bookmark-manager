import { DragDropClassCSS, LayoutRefCSS } from '@proj-const';
import { Util } from '../../utilities/util/util.js';
import { DropZone, DroppableCallbacks } from '@proj-types';

export const bkmDroppableConfig: (
  onDrop: (dragstartTarget: HTMLElement, dropTarget: HTMLElement, dropZone: DropZone) => void
) => DroppableCallbacks = (onDrop) => ({
  callbackId: 'node-bkm-droppable',
  getDropTarget: function (e: MouseEvent, dragstartTarget: HTMLElement): HTMLElement | null {
    return e.target instanceof HTMLElement && Util.dragDrop.isFolderOrBkmElement(dragstartTarget)
      ? Util.dragDrop.getBookmarkElement(e.target)
      : null;
  },
  onDragover: function (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dragOverTarget: HTMLElement,
    dropZone: DropZone
  ): void {
    Util.dragDrop.cleanupDragDropClasses(false);
    dragOverTarget.classList.add(DragDropClassCSS.OVER);

    if (Util.dragDrop.isInRowFlow(dragOverTarget)) {
      dragOverTarget.classList.add(dropZone.lftHlf);
      Util.nodeIndices.addLftRgtClassToAdjacentNodeEl(dragOverTarget, dropZone.lftHlf);
    } else {
      dragOverTarget.classList.add(dropZone.topHlf);
      Util.nodeIndices.addTopBotClassToAdjacentEl(dragOverTarget, dropZone.topHlf);
    }
  },
  onDropover: function (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dropTarget: HTMLElement,
    dropZone: DropZone
  ): void {
    onDrop(dragstartTarget, dropTarget, dropZone);
  },
  scrollElement: (dragOverTarget: HTMLElement) => {
    // let parent: HTMLElement | null;
    // while ((parent = dragOverTarget.parentElement)) {
    //   if (parent.id === LayoutRefCSS.MIDDLE_CONT_ID) break;
    // }
    // return parent;

    return document.getElementById(LayoutRefCSS.MIDDLE_CONT_ID);
  }
});

export const folDroppableConfig: (
  onDrop: (dragstartTarget: HTMLElement, dropTarget: HTMLElement, dropZone: DropZone) => void
) => DroppableCallbacks = (onDrop) => ({
  callbackId: 'node-fol-droppable',
  getDropTarget: function (e: MouseEvent, dragstartTarget: HTMLElement): HTMLElement | null {
    return e.target instanceof HTMLElement && Util.dragDrop.isFolderOrBkmElement(dragstartTarget)
      ? Util.dragDrop.getFolderElement(e.target)
      : null;
  },
  onDragover: function (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dragOverTarget: HTMLElement,
    dropZone: DropZone
  ): void {
    Util.dragDrop.cleanupDragDropClasses(false);
    dragOverTarget.classList.add(DragDropClassCSS.OVER);

    let droppingIntoFol = false;
    if (Util.dragDrop.isInRowFlow(dragOverTarget)) {
      if (dropZone.lftRgt) {
        dragOverTarget.classList.add(dropZone.lftRgt);
      } else {
        droppingIntoFol = true;
        dragOverTarget.classList.add(DragDropClassCSS.MID);
      }

      if (!droppingIntoFol) {
        Util.nodeIndices.addLftRgtClassToAdjacentNodeEl(dragOverTarget, dropZone.lftHlf);
      }
    } else {
      if (dropZone.topBot) {
        dragOverTarget.classList.add(dropZone.topBot);
      } else {
        droppingIntoFol = true;
        dragOverTarget.classList.add(DragDropClassCSS.MID);
      }

      if (!droppingIntoFol) {
        Util.nodeIndices.addTopBotClassToAdjacentEl(dragOverTarget, dropZone.topHlf);
      }
    }
  },
  onDropover: function (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dropTarget: HTMLElement,
    dropZone: DropZone
  ): void {
    onDrop(dragstartTarget, dropTarget, dropZone);
  },
  scrollElement: (dragOverTarget: HTMLElement) =>
    document.getElementById(LayoutRefCSS.MIDDLE_CONT_ID)
});
