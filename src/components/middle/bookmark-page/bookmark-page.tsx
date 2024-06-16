import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropClassCSS, PageRefCSS } from '@proj-const';
import {
  BKM_DISPLAY_ORDER,
  BookmarkTreeDataNode,
  DragoverOrDropType,
  DragstartType,
  DropInfo,
  DropZone,
  FLOW,
  MODE,
  NodeType,
  PAGES,
  SearchData
} from '@proj-types';
import {
  AppDispatchType,
  ReduxSelectorForArrOfElements,
  RootStateType,
  deselectAll,
  dragend,
  dragstart,
  dropOver,
  dropOverSettings,
  selectDeselectNode
} from '@proj-state';
import {
  bkmOrFolDraggableConfig,
  DragDropManager,
  Util,
  bkmDroppableConfig,
  folDroppableConfig,
  bkmContainerDroppableConf
} from '@proj-scripts';
import { NodeChildrenColumn } from './column-node-children.js';
import { NodeComponent } from './node-component.js';

// prettier-ignore
type T = [
  BookmarkTreeDataNode,
  MODE, FLOW, BKM_DISPLAY_ORDER,
  number,
  boolean,
  SearchData | null,
  PAGES
];
const stateSelectorBookmarkPage = new ReduxSelectorForArrOfElements<T>((state: RootStateType) => [
  state.bookmarks.currNode,
  state.transient.currMode,
  state.settings.flowDirection,
  state.settings.bkmDisplayOrder,
  state.settings.bkmFolderColCount,
  !!state.bookmarks.showSearch,
  state.bookmarks.searchData || null,
  state.transient.currPage
]).selector;

export const BookmarkPage: React.FC<any> = () => {
  // prettier-ignore
  const [
    node,
    mode, flowDirection, displayOrder,
    columnCount,
    showSearch,
    searchData,
    currPageType
  ] = useSelector<RootStateType, T>(stateSelectorBookmarkPage);
  const dispatch = useDispatch<AppDispatchType>();
  const onDragstart = (dragstartTarget: HTMLElement) => {
    let dragStartDetails = Util.dragDrop.getDragnodeDetails(dragstartTarget);
    if (!dragStartDetails) return;

    dispatch(selectDeselectNode({ id: dragStartDetails.id, selectOnly: true }));
    dispatch(
      dragstart({
        dragstartNode: dragStartDetails.id,
        dragType: dragStartDetails.type === NodeType.FOL ? DragstartType.FOL : DragstartType.BKM
      })
    );
  };
  const onDragEnd = () => {
    dispatch(dragend());
    dispatch(deselectAll());
  };

  const onDrop = (dragstartTarget: HTMLElement, dropTarget: HTMLElement, dropZone: DropZone) => {
    // dispatch;
    // console.log(`Bookmark Drop: ${dropTarget} | ${dropZone}`);
    let dropTargetDetails = Util.dragDrop.getDropnodeDetails(dropTarget);
    if (!dropTargetDetails) return;

    let dropInfo: DropInfo = {
      dropZone,
      dropType:
        dropTargetDetails?.type === NodeType.BKM ? DragoverOrDropType.BKM : DragoverOrDropType.FOL,
      dropTarget: dropTargetDetails?.id ?? null
    };

    dispatch(dropOver(dropInfo));
    dispatch(dropOverSettings(dropInfo));
  };
  const onDropOnContainer = (dragstartTarget: HTMLElement) => {
    let dragstartDetails = Util.dragDrop.getDragnodeDetails(dragstartTarget);
    if (!dragstartDetails) return;

    let dropInfo: DropInfo = {
      dropZone: {
        topBot: null,
        lftRgt: null,
        middle: DragDropClassCSS.MID,
        lftHlf: DragDropClassCSS.LFT,
        topHlf: DragDropClassCSS.TOP
      },
      dropType: DragoverOrDropType.NOD_CONTAINER,
      dropTarget: node.id
    };

    dispatch(dropOver(dropInfo));
    dispatch(dropOverSettings(dropInfo));
  };

  let visibleNodes =
    currPageType === PAGES.recent
      ? Util.nodeIndices.getChildBkmNodesByDate(node)
      : showSearch && searchData
        ? searchData.result.map((nodeAndScore) => nodeAndScore.node)
        : node.children;
  visibleNodes =
    displayOrder === BKM_DISPLAY_ORDER.groupAndSort && currPageType === PAGES.bkmFolder
      ? Util.nodeIndices.groupAndSortNodes(visibleNodes)
      : visibleNodes;

  const childElements = visibleNodes.map((node) => (
    <NodeComponent {...{ node, mode, inOddSubFolder: false }} key={node.id} />
  ));

  const childColumns = [];
  for (let i = 0; i < columnCount; i++) {
    childColumns.push(
      <NodeChildrenColumn
        {...{ flowDirection, columnCount, columnIndex: i, childElements, isRootCol: true }}
        key={Util.nodeIndices.getNodeChildrenColKey(i, columnCount)}
      />
    );
  }

  useEffect(() => {
    DragDropManager.instance.addDraggableCallbacks(bkmOrFolDraggableConfig(onDragstart, onDragEnd));
    DragDropManager.instance.addDroppableCallbacks(bkmDroppableConfig(onDrop));
    DragDropManager.instance.addDroppableCallbacks(folDroppableConfig(onDrop));

    DragDropManager.instance.addDroppableCallbacks(bkmContainerDroppableConf(onDropOnContainer));
  });

  return (
    <div>
      {showSearch && searchData ? <SearchStats {...{ searchData, node }} /> : ''}
      <div
        id={
          showSearch || currPageType === PAGES.recent
            ? PageRefCSS.SEARCH_OR_RECENT_CONT_ID
            : PageRefCSS.BOOKMARK_CONT_ID
        }
      >
        {childColumns}
      </div>
    </div>
  );
};

const SearchStats: React.FC<{ searchData: SearchData; node: BookmarkTreeDataNode }> = ({
  searchData,
  node
}) => {
  const stats = searchData.stats;

  return (
    <div>
      <div>{`Searching within "${node.title}" folder for ${searchData.query}...`}</div>
      <div>{`(Total: ${stats.nFolTotal} folders and ${stats.nBkmTotal} bookmarks in current folder.)`}</div>
      <div>
        {searchData.query && searchData.query.length > 0
          ? `(Found ${stats.nFol}) folders and ${stats.nBkm} bookmarks in ${stats.duration} milliseconds.`
          : ``}
      </div>
    </div>
  );
};
