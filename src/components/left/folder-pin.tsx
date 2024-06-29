import { useDispatch, useSelector } from 'react-redux';
import {
  AppDispatchType,
  RootStateType,
  unpin,
  recheckPins,
  setCurrNode,
  ReduxSelectorForArrOfElements,
  page,
  dragstart,
  dragend,
  dropOver,
  dropOverSettings,
  deselectAll
} from '@proj-state';
import { DragDropClassCSS, MinorElementsRefCSS } from '@proj-const';
import {
  DragoverOrDropType,
  DragstartType,
  DropInfo,
  DropZone,
  NodeType,
  Pages,
  PinCtxMenuProps
} from '@proj-types';
import {
  DragDropManager,
  Util,
  folPinDraggableConfig,
  folPinDroppableConfig,
  pinContainerDroppableConf
} from '@proj-scripts';
import { BsXSquare } from '../project-icons.js';
import { useEffect, useState } from 'react';
import { PinCtxMenu } from '../context-menu/ctx-menu-pin.js';

type Pin = PinCtxMenuProps['pin'];

const RmvPinButton: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useDispatch<AppDispatchType>();
  const rmvPin = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    dispatch(unpin(id));
    e.stopPropagation();
  };

  return (
    <span className={MinorElementsRefCSS.PIN_RMV_BTN} onClick={rmvPin}>
      <BsXSquare />
    </span>
  );
};

const PinnedFolderLink: React.FC<{
  id: string;
  homePinId: string | undefined;
  removable: boolean;
  title: string;
  isSelected: boolean;
}> = ({ id, homePinId, title, removable, isSelected }) => {
  const dispatch = useDispatch<AppDispatchType>();
  const [showCtxMenu, setShowCtxMenu] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const closeMenu = () => setShowCtxMenu(false);

  return (
    <div
      className={Util.misc.mergeClassNames(
        MinorElementsRefCSS.PIN_FOL,
        !removable ? MinorElementsRefCSS.PIN_FOL_NON_RMV : '',
        isSelected ? MinorElementsRefCSS.PIN_FOL_SEL : '',
        id === homePinId ? MinorElementsRefCSS.PIN_FOL_HOME : ''
      )}
      id={Util.misc.getPinFolElId(id)}
      onClick={() => {
        dispatch(page({ page: Pages.BKM_FOLDER, folder: id }));
        dispatch(deselectAll());
        dispatch(setCurrNode(id));
        dispatch(recheckPins());
        closeMenu();
      }}
      onContextMenu={(e) => {
        setShowCtxMenu(true);
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
      }}
    >
      <span>{title}</span>
      {removable ? <RmvPinButton id={id} /> : ''}
      {showCtxMenu ? (
        <PinCtxMenu pin={{ id, title, removable }} closeMenu={closeMenu} position={menuPos} />
      ) : (
        ''
      )}
    </div>
  );
};

type T = [Pin[], string | undefined, string, boolean];
const stateSelectorFolderPins = new ReduxSelectorForArrOfElements(
  (state: RootStateType): T => [
    state.settings.pinnedFolders,
    state.settings.homeFolder,
    state.bookmarks.currNode.id,
    state.transient.currPage === Pages.BKM_FOLDER
  ]
).selector;
export const FolderPins: React.FC<any> = () => {
  const [pins, homePinId, currId, isBkmPage] = useSelector<RootStateType, T>(
    stateSelectorFolderPins
  );
  const dispatch = useDispatch<AppDispatchType>();

  const onDragstart = (dragstartTarget: HTMLElement) => {
    let dragstartNode = Util.dragDrop.getDragpinDetails(dragstartTarget);
    if (!dragstartNode) return;

    dispatch(
      dragstart({
        dragstartNode: dragstartNode.id,
        dragType: DragstartType.PIN
      })
    );
  };
  const onDrop = (dragstartTarget: HTMLElement, dropTarget: HTMLElement, dropZone: DropZone) => {
    // dispatch;
    // console.log(`Pin Drop: ${dropTarget} | ${dropZone}`);
    let dropInfo: DropInfo = {
      dropTarget: Util.dragDrop.getDragpinDetails(dropTarget)!.id,
      dropType: Util.dragDrop.getDropType(dropTarget),
      dropZone
    };
    dispatch(dropOver(dropInfo));
    dispatch(dropOverSettings(dropInfo));
  };
  const onDropOnContainer = (dragstartTarget: HTMLElement) => {
    let dragstartDetails = Util.dragDrop.getDragnodeDetails(dragstartTarget),
      dropInfo: DropInfo = {
        dropZone: {
          topBot: null,
          lftRgt: null,
          middle: DragDropClassCSS.MID,
          lftHlf: DragDropClassCSS.LFT,
          topHlf: DragDropClassCSS.TOP
        },
        dropType: DragoverOrDropType.PIN_CONTAINER,
        dropTarget: null
      };
    if (!dragstartDetails || dragstartDetails.type === NodeType.BKM) return;

    dispatch(dropOver(dropInfo));
    dispatch(dropOverSettings(dropInfo));
  };
  const onDragEnd = () => {
    dispatch(dragend());
    dispatch(deselectAll());
  };

  useEffect(() => {
    DragDropManager.instance.addDraggableCallbacks(folPinDraggableConfig(onDragstart, onDragEnd));
    DragDropManager.instance.addDroppableCallbacks(folPinDroppableConfig(onDrop));

    DragDropManager.instance.addDroppableCallbacks(pinContainerDroppableConf(onDropOnContainer));
  });
  const hasRemovablePins = !!pins.find((pin) => !!pin.removable);

  return (
    <div className={MinorElementsRefCSS.PIN_FOL_CONT}>
      {pins.map((pin) => (
        <PinnedFolderLink
          {...{ ...pin, homePinId, isSelected: pin.id === currId && isBkmPage }}
          key={pin.id}
        />
      ))}
      {hasRemovablePins ? (
        <></>
      ) : (
        <div className={MinorElementsRefCSS.PIN_FOL_TIP}>Drag folders below.</div>
      )}
    </div>
  );
};
