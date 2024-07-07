import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatchType } from '@proj-state';
import { BookmarkTreeDataNode, MODE, NodeCommonStateEvents, NodeType, Position } from '@proj-types';
import { Bookmark } from './node-bookmark.js';
import { Folder } from './node-folder.js';
import { NodeModel } from './node-model.js';

export const NodeComponent: React.FC<{
  node: BookmarkTreeDataNode;
  mode: MODE;
  inOddSubFolder: boolean;
}> = ({ node, mode, inOddSubFolder }) => {
  const dispatch = useDispatch<AppDispatchType>();

  const smRef = useRef(NodeModel.createNewNodeStateMachine(node.type === NodeType.FOL));
  const [state, setState] = useState(smRef.current.getState());
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });

  const handleNodeStateEvent = (event: NodeCommonStateEvents) => {
    smRef.current.handle(event);
    setState(smRef.current.getState());
  };
  const updateMenuPosition = (position: { x: number; y: number }) => setMenuPosition(position);

  const model = new NodeModel(
    node,
    mode,
    smRef.current.getState(),
    handleNodeStateEvent,
    updateMenuPosition,
    dispatch
  );
  const className = model.getClassName();

  let childElements: React.JSX.Element[] = [];
  if (NodeModel.isFolderState(state, node)) {
    childElements = state.childrenInit
      ? node.children.map((child) => (
          <NodeComponent key={child.id} node={child} mode={mode} inOddSubFolder={!inOddSubFolder} />
        ))
      : [];
  }

  const commonProps = { node, className, menuPosition };

  return NodeModel.isFolderState(state, node) ? (
    <Folder {...{ ...commonProps, childElements, state, ...model.getHandlers(), inOddSubFolder }} />
  ) : (
    <Bookmark {...{ ...commonProps, state, ...model.getHandlers() }} />
  );
};
