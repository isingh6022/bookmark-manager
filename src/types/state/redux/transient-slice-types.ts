import { NodeType } from '../../data/node.js';
import { DragstartType } from '../drag-types.js';
import { PopupConfig } from './popup-types.js';

enum MODE {
  default,
  edit
}

enum PAGES {
  duplicates,
  recent,
  bkmFolder // default state when a bkm folder is being displayed.
}

interface DragNodeData {
  id: string;
  type: NodeType;
  title: string;
}

interface TransientState {
  visitedFolderIds: string[];
  currPage: PAGES;
  currMode: MODE;
  dragDrop: {
    dragging: boolean;
    dragstartNode?: DragNodeData;
    dragstartType?: DragstartType;
    dragDropId?: string;
  };
  popup: PopupConfig | null;
}

export { MODE, PAGES };
export type { TransientState, DragNodeData };
