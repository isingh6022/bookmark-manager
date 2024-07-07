import { BookmarkTreeDataNode } from '../data/node.js';
import { Position } from './layout.js';

export interface BkmFolNodeProps {
  node: BookmarkTreeDataNode;
  className: string;

  onClick: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;

  menuPosition: Position;
  onContextMenu: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closeMenu: () => void;
  rename: () => void;
  renameBlur: (newTitle: string) => void;

  // onDragstart: React.DragEventHandler<HTMLElement>;
  // onDragOver: React.DragEventHandler<HTMLElement>;
  // onDrop: React.DragEventHandler<HTMLElement>;
}
