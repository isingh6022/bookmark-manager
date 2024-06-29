import { NodeType } from '../../data/node.js';
import { DragstartType } from '../drag-types.js';
import { PopupConfig } from './popup-types.js';

enum Mode {
  DEFAULT,
  EDIT
}

enum Pages {
  DUPLICATES,
  RECENT,
  BKM_FOLDER // default state when a bkm folder is being displayed.
}

interface DragNodeData {
  id: string;
  type: NodeType;
  title: string;
}

interface TransientState {
  visitedFolderIds: string[];
  currPage: Pages;
  currMode: Mode;
  dragDrop: {
    dragging: boolean;
    dragstartNode?: DragNodeData;
    dragstartType?: DragstartType;
    dragDropId?: string;
  };
  popup: PopupConfig | null;
}

export { Mode, Pages };
export type { TransientState, DragNodeData };
