import React from 'react';
import { BkmFolNodeProps, FolderStateObject } from '@proj-types';
import { BsFolder, BsFolder2Open } from '../../project-icons.js';
import { NodeChildrenColumn } from './column-node-children.js';
import { FolCtxMenu } from '../../context-menu/ctx-menu-folder.js';
import { Util } from '@proj-scripts';
import { NodeRenameInput } from './node-rename-input.js';

export const Folder: React.FC<
  BkmFolNodeProps & {
    childElements: React.JSX.Element[];
    state: FolderStateObject;
    inOddSubFolder: boolean;
  }
> = ({
  node,
  onClick,
  className,
  childElements,
  state,
  onContextMenu,
  menuPosition,
  closeMenu,
  rename,
  renameBlur,
  inOddSubFolder
}) => {
  const id = Util.misc.getBkmFolNodeElId(node.id),
    position = menuPosition,
    isCollapsed = !state.expanded,
    expandCollapse = onClick;

  const titleProps: {
    id?: string;
    className?: string;
    onClick: (e?: React.MouseEvent<HTMLElement>) => void;
    onContextMenu: (e: React.MouseEvent<HTMLElement>) => void;
  } = {
    onClick,
    onContextMenu
  };
  if (!state.childrenInit) {
    titleProps['id'] = id;
    titleProps['className'] = className;
  }

  const renameInput: React.JSX.Element = (
    <span>
      <NodeRenameInput {...{ title: node.title, renameBlur }} />
    </span>
  );
  const titleElement: React.JSX.Element = (
    <span {...titleProps}>
      {state.expanded ? <BsFolder2Open /> : <BsFolder />}
      {node.title}
    </span>
  );

  return (
    <>
      {state.childrenInit ? (
        <div {...{ className, id }}>
          {state.editing ? renameInput : titleElement}
          <NodeChildrenColumn
            {...{
              childElements,
              animateHeight: true,
              collapse: !state.expanded,
              isRootCol: false,
              hasOddSubFolChildren: !inOddSubFolder
            }}
          ></NodeChildrenColumn>
        </div>
      ) : state.editing ? (
        renameInput
      ) : (
        titleElement
      )}
      {state.ctxMenu ? (
        <FolCtxMenu {...{ node, position, closeMenu, rename, isCollapsed, expandCollapse }} />
      ) : (
        ''
      )}
    </>
  );
};
