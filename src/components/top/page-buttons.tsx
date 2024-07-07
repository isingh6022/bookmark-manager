import { useDispatch, useSelector } from 'react-redux';

import {
  ComponentRefCSS,
  GenericClassCSS,
  MinorElementsRefCSS,
  ROOT_NODE_CONSTANTS,
  TIPS
} from '@proj-const';
import { Util } from '@proj-scripts';
import { page, popup, AppDispatchType, deselectAll, setCurrNode } from '@proj-state';
import { PAGES, Popup } from '@proj-types';
import { BsGear, BsCopy, BsCalendar2Date, MdOutlineColorLens } from '../project-icons.js';

const SettingsPageButton: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatchType>();

  return (
    <div
      onClick={() =>
        dispatch(
          popup({
            type: Popup.SETTINGS,
            title: 'Settings',
            message: 'Settings popup.',
            width: 450,
            closeOnOutsideClick: true
          })
        )
      }
      title={TIPS.SETTINGS}
    >
      <BsGear />
    </div>
  );
};

const ThemePageButton: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatchType>();

  return (
    <div
      onClick={() => {
        dispatch(
          popup({
            type: Popup.THEME,
            title: 'Themes',
            message: TIPS.THEME,
            width: 500,
            minContentHt: 300,
            closeOnOutsideClick: true,
            background: 'transparent'
          })
        );
      }}
      title={TIPS.THEME}
    >
      <MdOutlineColorLens />
    </div>
  );
};

const DuplicatesPageButton: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatchType>();

  return (
    <div
      onClick={() => {
        dispatch(setCurrNode(ROOT_NODE_CONSTANTS.id));
        dispatch(page({ page: PAGES.duplicates }));
        dispatch(deselectAll());
      }}
      title={TIPS.DUPLICATES}
    >
      <BsCopy />
    </div>
  );
};

const RecentsPageButton: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatchType>();

  return (
    <div
      onClick={() => {
        dispatch(setCurrNode(ROOT_NODE_CONSTANTS.id));
        dispatch(page({ page: PAGES.recent })), dispatch(deselectAll());
      }}
      title={TIPS.RECENT}
    >
      <BsCalendar2Date />
    </div>
  );
};

export const PageButtons: React.FC<any> = () => {
  return (
    <div
      id={ComponentRefCSS.PAGE_BTN_ID}
      className={Util.misc.mergeClassNames(
        GenericClassCSS.FLEX_ROW_CENTER_NOWRAP,
        GenericClassCSS.FLEX_J_START,
        MinorElementsRefCSS.ADDR_BAR_ICON_CONT
      )}
    >
      <SettingsPageButton /> <ThemePageButton /> <DuplicatesPageButton /> <RecentsPageButton />
    </div>
  );
};
