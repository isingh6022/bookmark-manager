import { DragDrop } from '../utilities/util/drag-drop-util.js';
import { DragDropManager } from './drag-drop-events.js';

DragDropManager.instance.beforeEachDragover(() => {
  DragDrop.cleanupDragDropClasses();
});

DragDropManager.instance.afterEachNoMatchDragover(() => {
  DragDrop.cleanupDragDropClasses();
});
