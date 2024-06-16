import { useDispatch } from 'react-redux';
import { CtxMenuOption, BkmCtxMenuProps, Popup, PropertiesPopup, PAGES } from '@proj-types';
import { AppDispatchType, rmv, popup, ico, showNode, setCurrNode, page, rmvIco } from '@proj-state';
import { CommonCtxMenuOptions, BkmCtxMenuOptions } from '@proj-const';
import { CtxMenu } from './context-menu.js';

type ReduxEvent =
  | ReturnType<typeof rmv>
  | ReturnType<typeof popup>
  | ReturnType<typeof ico>
  | ReturnType<typeof rmvIco>
  | ReturnType<typeof setCurrNode>
  | ReturnType<typeof page>
  | ReturnType<typeof showNode>;

export const BkmCtxMenu: React.FC<BkmCtxMenuProps> = ({
  node,
  position,
  closeMenu,
  url,
  rename
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

  // open in new tab
  options.push({
    title: BkmCtxMenuOptions.OPEN_NEW_TAB,
    onClick: () => window.open(url)
  });

  // rename
  options.push({ title: CommonCtxMenuOptions.RNM, onClick: rename });

  // edit
  // addOption(
  //   BkmCtxMenuOptions.EDIT,
  //   popup({ type: POPUP.edit, title: 'Edit bookmark', message: 'Editing a bookmark',
  //        width: 800, closeOnOutsideClick: true })
  // );

  // copy to folder
  // addOption(
  //   BkmCtxMenuOptions.CPY_TO_FOL,
  //   popup({ type: POPUP.copy, title: 'Copy to folder', message: 'Copying a bookmark',
  //        width: 800, closeOnOutsideClick: true })
  // );

  // icon only in top bar
  node.isIcon
    ? addOption(BkmCtxMenuOptions.SHW_FUL_NAM_OF_ICO, rmvIco(node.id))
    : addOption(BkmCtxMenuOptions.ICN_ONLY_TOP_BAR, ico(node.id));

  // different name in bookmark bar: TO_DO
  // addOption(CommonCtxMenuOptions.DIFF_NAME_BKM_BAR, CommonCtxMenuOptions.DIFF_NAME_BKM_BAR);

  // // show in parent folder: TO_DO
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
  //     message: 'Move bookmark to another folder',
  //     width: 300,
  //     closeOnOutsideClick: true
  //   })
  // );

  // delete
  addOption(CommonCtxMenuOptions.DEL, rmv(node.id));

  return <CtxMenu {...{ position, options, closeMenu }} />;
};
