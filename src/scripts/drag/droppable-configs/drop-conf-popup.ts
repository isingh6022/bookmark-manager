import { DroppableCallbacks } from '@proj-types';

export const popupDroppableConfig: (
  onDrag: (e: MouseEvent) => void,
  onDrop: (e: MouseEvent) => void
) => DroppableCallbacks = (onDrag, onDrop) => ({
  callbackId: 'popup-droppable',
  getDropTarget: (e: MouseEvent): HTMLElement | null => {
    return e.target as HTMLElement;
  },
  onDragover: (e: MouseEvent): void => onDrag(e),
  onDropover: (e: MouseEvent) => {
    onDrop(e);
  },
  scrollElement: null
});
