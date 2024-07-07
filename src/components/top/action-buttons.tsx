import { useDispatch, useSelector } from 'react-redux';
import { Util } from '@proj-scripts';
import {
  ComponentRefCSS,
  GenericClassCSS,
  MinorElementsRefCSS,
  ROOT_NODE_CONSTANTS,
  TIPS
} from '@proj-const';
import {
  mode,
  AppDispatchType,
  RootStateType,
  deselectAll,
  popup,
  ReduxSelectorForArrOfElements
} from '@proj-state';
import { BsFolderPlus, BsPencilSquare, BsPencilFill } from '../project-icons.js';
import { BookmarkTreeDataNode, MODE, NewFolderPopup, PAGES, Popup } from '@proj-types';

const NewFolderButton: React.FC<{ currNodeId: string }> = ({ currNodeId }) => {
  const dispatch = useDispatch<AppDispatchType>();

  return (
    <div
      onClick={() =>
        dispatch(
          popup({
            type: Popup.NEW_FOL,
            title: '', // added in info-popup html.
            message: '', // added using parentId
            width: 400,
            closeOnOutsideClick: true,
            parentId: currNodeId
          } as NewFolderPopup)
        )
      }
      title={TIPS.NEW_FOLDER}
    >
      <BsFolderPlus />
    </div>
  );
};

const EditModeButton: React.FC<{ currMode: MODE }> = ({ currMode }) => {
  const dispatch = useDispatch<AppDispatchType>();
  const editMode = currMode === MODE.edit;

  const onClick = () => {
    dispatch(mode(editMode ? MODE.default : MODE.edit));
    dispatch(deselectAll());
  };

  return (
    <div
      className={editMode ? MinorElementsRefCSS.EDIT_BTN_EDITING : ''}
      {...{ onClick }}
      title={TIPS.EDIT_MODE}
    >
      {editMode ? <BsPencilFill /> : <BsPencilSquare />}
    </div>
  );
};

const newFolButtonSelector = new ReduxSelectorForArrOfElements(
  (state: RootStateType): [BookmarkTreeDataNode, PAGES, MODE] => [
    state.bookmarks.currNode,
    state.transient.currPage,

    state.transient.currMode
  ]
).selector;
export const ActionButtons: React.FC<any> = () => {
  const [currNode, page, currMode] = useSelector(newFolButtonSelector);
  return page === PAGES.bkmFolder && currNode && currNode.id !== ROOT_NODE_CONSTANTS.id ? (
    <div
      className={Util.misc.mergeClassNames(
        GenericClassCSS.FLEX_ROW_CENTER_NOWRAP,
        MinorElementsRefCSS.ADDR_BAR_ICON_CONT
      )}
      id={ComponentRefCSS.ACTN_BTN_ID}
    >
      <NewFolderButton currNodeId={currNode.id} />
      <EditModeButton {...{ currMode }} />
    </div>
  ) : (
    <></>
  );
};
