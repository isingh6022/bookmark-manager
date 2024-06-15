import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ComponentRefCSS, GenericClassCSS, SHIFT_DRAG_EL } from '@proj-const';
import { BookmarkTreeDataNode, DragNodeData, DragstartType, NodeType } from '@proj-types';
import { Util } from '@proj-scripts';
import { ReduxSelectorForArrOfElements, RootStateType } from '@proj-state';
import { BkmIco } from '../middle/bookmark-page/node-bookmark-icon.js';
import { BsFolder } from '../project-icons.js';

type U = [DragstartType | undefined, boolean, DragNodeData | undefined, BookmarkTreeDataNode];
const stateSelectorDragDrop = new ReduxSelectorForArrOfElements<U>((state: RootStateType) => [
  state.transient.dragDrop.dragstartType,
  state.transient.dragDrop.dragging,
  state.transient.dragDrop.dragstartNode,
  state.bookmarks.currNode
]).selector;
export const DragDrop: React.FC<any> = () => {
  const [dragstartType, dragging, dragstartNode, currNode] = useSelector<RootStateType, U>(
    stateSelectorDragDrop
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dragCallback = (e: MouseEvent) => {
      if (dragging) {
        const dragElem = ref.current,
          remSize = Util.misc.getRemSize() || 1;

        if (dragElem) {
          dragElem.style.left = `${e.clientX + SHIFT_DRAG_EL.x * remSize}px`;
          dragElem.style.top = `${e.clientY + SHIFT_DRAG_EL.y * remSize}px`;
        }
      }
    };
    const removeCallback = () => {
      // This was called twice for first time!!! - even though it removes itself from listeners.
      window.removeEventListener('mousemove', dragCallback);
      window.removeEventListener('mouseup', removeCallback);
    };
    window.addEventListener('mousemove', dragCallback);
    window.addEventListener('mouseup', removeCallback);
  });

  if (!dragging) return <></>;

  const selectedNodes = Util.misc.getSelectedVisibleNodes(currNode);
  const onlyEl = (
    <>
      {dragstartNode?.type === NodeType.BKM ? (
        <BkmIco url={selectedNodes[0]?.url || ''} />
      ) : (
        <BsFolder />
      )}
      {dragstartNode?.title}
    </>
  );
  let folCount = 0,
    bkmCount = 0;
  selectedNodes.forEach((node) => (node.type === NodeType.FOL ? folCount++ : bkmCount++));

  return (
    <div
      id={ComponentRefCSS.DRG_DRP_ELEM_ID}
      className={Util.misc.mergeClassNames(
        dragstartType === DragstartType.PIN ? 'drag-pin' : '',
        GenericClassCSS.FLEX_ROW_CENTER_NOWRAP
      )}
      ref={ref}
    >
      {selectedNodes.length === 1 || dragstartType === DragstartType.PIN ? (
        onlyEl
      ) : (
        <>
          <BsFolder /> {folCount} folders |
          <BkmIco url={'random url'} /> {bkmCount} bookmarks
        </>
      )}
    </div>
  );
};
