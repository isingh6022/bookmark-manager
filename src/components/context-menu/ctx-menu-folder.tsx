import { useDispatch } from 'react-redux';
import {
  AppDispatchType,
  rmv,
  popup,
  ico,
  showNode,
  page,
  setCurrNode,
  pin,
  deselectAll
} from '@proj-state';
import {
  CtxMenuOption,
  DeleteFolderPopup,
  FolCtxMenuProps,
  PAGES,
  Popup,
  PropertiesPopup
} from '@proj-types';
import { CommonCtxMenuOptions, FolCtxMenuOptions } from '@proj-const';
import { CtxMenu } from './context-menu.js';

type ReduxEvent =
  | ReturnType<typeof rmv>
  | ReturnType<typeof popup>
  | ReturnType<typeof ico>
  | ReturnType<typeof pin>
  | ReturnType<typeof setCurrNode>
  | ReturnType<typeof page>
  | ReturnType<typeof showNode>;

export const FolCtxMenu: React.FC<FolCtxMenuProps> = ({
  node,
  position,
  closeMenu,
  isCollapsed,
  rename,
  expandCollapse
}) => {
  const options: CtxMenuOption[] = [];

  const dispatch = useDispatch<AppDispatchType>();
  const addOption = (title: string, event: ReduxEvent | ReduxEvent[]) => {
    if (Array.isArray(event)) {
      options.push({
        title,
        onClick: () => {
          event.forEach((e) => dispatch(e));
        }
      });
    } else {
      options.push({ title, onClick: () => dispatch(event) });
    }
  };

  // rename
  options.push({ title: CommonCtxMenuOptions.RNM, onClick: rename });

  // exand | collapse
  options.push({
    title: isCollapsed ? FolCtxMenuOptions.EXPAND : FolCtxMenuOptions.COLLAPSE,
    onClick: expandCollapse
  });

  // open full
  options.push({
    title: FolCtxMenuOptions.OPEN_FULL,
    onClick: () => {
      dispatch(page({ page: PAGES.bkmFolder, folder: node.id }));
      dispatch(deselectAll());
      dispatch(setCurrNode(node.id));
    }
  });

  // different name in bookmark bar
  // addOption(CommonCtxMenuOptions.DIFF_NAME_BKM_BAR, CommonCtxMenuOptions.DIFF_NAME_BKM_BAR);

  // pin
  addOption(FolCtxMenuOptions.PIN, pin({ id: node.id, index: 0 }));

  // // show in parent folder
  // addOption(CommonCtxMenuOptions.SHW_PRNT_FOL, showNode({ id: node.id, showInParent: true }));

  // // show in root folder
  // addOption(CommonCtxMenuOptions.SHW_ROOT_FOL, showNode({ id: node.id, showInParent: false }));

  // Open node location
  addOption(CommonCtxMenuOptions.OPEN_LOCATION, [
    setCurrNode(node.parentId),
    page({ page: PAGES.bkmFolder, folder: node.parentId })
  ]);

  // show properties
  addOption(
    CommonCtxMenuOptions.SHW_PROPS,
    popup({
      type: Popup.PROPERTIES,
      title: '', // Determined by popup.
      message: '',
      width: 450,
      closeOnOutsideClick: true,
      nodeId: node.id
    } as PropertiesPopup)
  );

  // move
  // addOption(
  //   CommonCtxMenuOptions.MOV,
  //   popup({
  //     type: POPUP.move,
  //     title: 'Move',
  //     message: 'Move folder to another folder',
  //     width: 300,
  //    closeOnOutsideClick: true
  //   })
  // );

  // delete
  addOption(
    CommonCtxMenuOptions.DEL,
    popup({
      type: Popup.DEL_FOL,
      title: '',
      message: '',
      width: 450,
      closeOnOutsideClick: true,
      nodeId: node.id
    } as DeleteFolderPopup)
  );

  return <CtxMenu {...{ position, options, closeMenu }} />;
};
