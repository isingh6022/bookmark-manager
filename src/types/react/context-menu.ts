import { BookmarkTreeDataNode, Pin } from '../data/node.js';
import { Position } from './layout.js';

enum CtxMenuType {
  BKM,
  FOL,
  PIN
}

interface CtxMenuOption {
  title: string;
  onClick: () => void;
}

interface CtxMenuProps {
  position: Position;
  closeMenu: () => void;
}

interface PinCtxMenuProps extends CtxMenuProps {
  pin: Pin;
  // allPins: Pin[];
  isHome?: boolean;
}

interface NodeCtxMenuProps extends CtxMenuProps {
  node: BookmarkTreeDataNode;
  rename: () => void;
}
interface FolCtxMenuProps extends NodeCtxMenuProps {
  isCollapsed: boolean;
  expandCollapse: () => void;
}

interface BkmCtxMenuProps extends NodeCtxMenuProps {
  url: string;
}

export type { CtxMenuOption, PinCtxMenuProps, FolCtxMenuProps, BkmCtxMenuProps };
export { CtxMenuType };
