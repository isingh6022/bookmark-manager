import { DragDropClassCSS, LayoutRefCSS } from '@proj-const';
import { Util } from '../../utilities/util/util.js';
import { DropZone, DroppableCallbacks, NodeType } from '@proj-types';

export const pinContainerDroppableConf: (
  onDrop: (dragstartTarget: HTMLElement) => void
) => DroppableCallbacks = (onDrop) => ({
  callbackId: 'pin-container-droppable',
  getDropTarget: (e: MouseEvent, dragstartTarget: HTMLElement): HTMLElement | null => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) {
      return null;
    }

    return Util.dragDrop.isFolderElement(dragstartTarget)
      ? Util.dragDrop.getPinContainerParent(el)
      : null;
  },
  onDragover: (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dragOverTarget: HTMLElement,
    dropZone: DropZone
  ): void => {
    dragOverTarget.classList.add(DragDropClassCSS.OVER);
  },
  onDropover: (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dropTarget: HTMLElement,
    dropZone: DropZone
  ): void => {
    onDrop(dragstartTarget);
  },
  scrollElement: null
});

export const bkmContainerDroppableConf: (
  onDrop: (dragstartTarget: HTMLElement) => void
) => DroppableCallbacks = (onDrop) => ({
  callbackId: 'bkm-container-droppable',
  getDropTarget: (e: MouseEvent, dragstartTarget: HTMLElement): HTMLElement | null => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) {
      return null;
    }
    return Util.dragDrop.isFolderOrBkmElement(dragstartTarget)
      ? Util.dragDrop.getBkmPageContainerParent(el)
      : null;
  },
  onDragover: (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dragOverTarget: HTMLElement,
    dropZone: DropZone
  ): void => {
    dragOverTarget.classList.add(DragDropClassCSS.OVER);
  },
  onDropover: (
    e: MouseEvent,
    dragstartTarget: HTMLElement,
    dropTarget: HTMLElement,
    dropZone: DropZone
  ): void => {
    onDrop(dragstartTarget);
  },
  scrollElement: (dragOverTarget: HTMLElement) =>
    document.getElementById(LayoutRefCSS.MIDDLE_CONT_ID)
});
