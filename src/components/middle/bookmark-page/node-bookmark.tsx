import { BkmFolNodeProps, NodeStateObject } from '@proj-types';
import { Util } from '@proj-scripts';
import { BkmIco } from './node-bookmark-icon.js';
import { BkmCtxMenu } from '../../context-menu/ctx-menu- bookmark.js';
import { NodeRenameInput } from './node-rename-input.js';

export const Bookmark: React.FC<
  BkmFolNodeProps & {
    state: NodeStateObject;
  }
> = ({
  node,
  className,
  state,
  onClick,
  onContextMenu,
  menuPosition,
  closeMenu,
  rename,
  renameBlur
}) => {
  const id = Util.misc.getBkmFolNodeElId(node.id),
    position = menuPosition,
    url = node.url;

  return (
    <a {...{ className, onClick, onContextMenu, id }}>
      <BkmIco url={node.url} />{' '}
      {state.editing ? (
        <NodeRenameInput {...{ title: node.title, renameBlur }} />
      ) : node.isIcon ? (
        `(${node.title})`
      ) : (
        node.title
      )}
      {state.ctxMenu ? <BkmCtxMenu {...{ node, position, closeMenu, url, rename }} /> : ''}
    </a>
  );
};
