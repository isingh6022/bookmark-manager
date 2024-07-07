import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootStateType, dragend, popup as popupEvent } from '@proj-state';
import { DragDropManager, Util, popupDraggableConfig, popupDroppableConfig } from '@proj-scripts';
import {
  TransientState,
  PopupConfig,
  Popup,
  PropertiesPopup,
  InfoPopup,
  ErrorPopup,
  WarnPopup,
  SuccessPopup,
  ConfirmPopup,
  SettingsPopup,
  NewFolderPopup,
  ThemePopup
} from '@proj-types';
import { GenericClassCSS, LayoutRefCSS, PopupElementsRefCSS } from '@proj-const';
import { Layer } from '../layout/layer.js';
import { SettingsPopupComponent } from './settings-popup.js';
import { InfoPopupComponent } from './info-popup.js';
import { ErrorPopupComponent } from './error-popup.js';
import { WarnPopupComponent } from './warn-popup.js';
import { SuccessPopupComponent } from './success-popup.js';
import { ConfirmPopupComponent } from './confirm-popup.js';
import { PropertiesPopupComponent } from './properties-popup.js';
import { NewFolderPopupComponent } from './new-folder-popup.js';
import { ThemePopupComponent } from './theme-popup.js';
import { BsXSquare } from '../project-icons.js';

const defaultPopupTitles: { [key in Popup]: string } = {
  [Popup.INFO]: 'Info',
  [Popup.ERROR]: 'Error',
  [Popup.WARN]: 'Warning',
  [Popup.SUCCESS]: 'Success',
  [Popup.CONFIRM]: 'Confirmation',
  [Popup.SETTINGS]: 'Settings',
  [Popup.PROPERTIES]: 'Properties',
  [Popup.NEW_FOL]: 'New Folder',
  [Popup.THEME]: 'Themes'
};

// prettier-ignore
const popupIdMap: { [key in Popup]: string } = {
  [Popup.INFO]:     PopupElementsRefCSS.INF_MSG_CONT_ID,
  [Popup.ERROR]:    PopupElementsRefCSS.ERR_MSG_CONT_ID,
  [Popup.WARN]:     PopupElementsRefCSS.WARNING_CONT_ID,
  [Popup.SUCCESS]:  PopupElementsRefCSS.SUCCESS_CONT_ID,
  [Popup.CONFIRM]:  PopupElementsRefCSS.CONFIRM_CONT_ID,
  [Popup.SETTINGS]: PopupElementsRefCSS.SETTING_CONT_ID,
  [Popup.PROPERTIES]: PopupElementsRefCSS.PROPERS_CONT_ID,
  [Popup.NEW_FOL]:   PopupElementsRefCSS.NEW_FOL_CONT_ID,
  [Popup.THEME]: PopupElementsRefCSS.THEME_CONT_ID
};

const PopupContent: React.FC<{ popup: PopupConfig }> = ({ popup }) => {
  switch (popup.type) {
    case Popup.INFO: {
      return <InfoPopupComponent {...(popup as InfoPopup)} />;
    }
    case Popup.ERROR: {
      return <ErrorPopupComponent {...(popup as ErrorPopup)} />;
    }
    case Popup.WARN: {
      return <WarnPopupComponent {...(popup as WarnPopup)} />;
    }
    case Popup.SUCCESS: {
      return <SuccessPopupComponent {...(popup as SuccessPopup)} />;
    }
    case Popup.CONFIRM: {
      return <ConfirmPopupComponent {...(popup as ConfirmPopup)} />;
    }
    case Popup.SETTINGS: {
      return <SettingsPopupComponent {...(popup as SettingsPopup)} />;
    }
    case Popup.PROPERTIES: {
      return <PropertiesPopupComponent {...(popup as PropertiesPopup)} />;
    }
    case Popup.NEW_FOL: {
      return <NewFolderPopupComponent {...(popup as NewFolderPopup)} />;
    }
    case Popup.THEME: {
      return <ThemePopupComponent {...(popup as ThemePopup)} />;
    }
    default:
      return <div>{popup.message}</div>;
  }
};

type T = TransientState['popup'];
const stateSelectorForPopup = (state: RootStateType): T => state.transient.popup;

export const PopupComponent: React.FC<any> = () => {
  const popupConfig = useSelector<RootStateType, T>(stateSelectorForPopup);
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(100);
  const [opacity, setOpacity] = useState(0);

  const onDragstart = (e: MouseEvent) => {
    const x1 = e.clientX,
      y1 = e.clientY;
    const newPos = (e: MouseEvent) => ({ x: left + e.clientX - x1, y: top + e.clientY - y1 });

    const onDrag = (e: MouseEvent) => {
      const position = newPos(e);
      if (ref.current) {
        ref.current.style.left = position.x + 'px';
        ref.current.style.top = position.y + 'px';
      }
    };

    const onDrop = (e: MouseEvent) => {
      const position = newPos(e);
      setLeft(position.x);
      setTop(position.y);
    };
    DragDropManager.instance.addDroppableCallbacks(popupDroppableConfig(onDrag, onDrop));
  };
  const onDragEnd = () => dispatch(dragend());

  useEffect(() => {
    popupConfig && setOpacity(1);
    setLeft((window.innerWidth - (popupConfig?.width || 0)) / 2);
    return () => setOpacity(0);
  }, [popupConfig?.popupId]);
  useEffect(() => {
    // Don't have to remove the following callback.
    DragDropManager.instance.addDraggableCallbacks(popupDraggableConfig(onDragstart, onDragEnd));
  });

  if (!popupConfig) return <></>;

  const closeLayerOnClick = () => {
    if (popupConfig.closeOnOutsideClick) {
      typeof popupConfig.closeOnOutsideClick === 'function' && popupConfig.closeOnOutsideClick();
      dispatch(popupEvent(null));
    }
  };

  const layerProps = {
    bgColor:
      popupConfig.background === 'transparent'
        ? undefined
        : popupConfig.background?.color || 'rgba(0,0,0,0.8)',
    closeLayerOnClick
  };

  return (
    <Layer {...layerProps}>
      <div
        {...{
          id: popupIdMap[popupConfig.type],
          style: { width: popupConfig.width, top, left, opacity },
          className: LayoutRefCSS.POPUP,
          ref
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          {...{
            className: Util.misc.mergeClassNames(
              GenericClassCSS.UNSELECTABLE,
              LayoutRefCSS.POPUP_TITLE
            )
          }}
        >
          <span>{popupConfig.title || defaultPopupTitles[popupConfig.type]}</span>
          {popupConfig.closeOnOutsideClick ? (
            <span
              onClick={() => {
                closeLayerOnClick();
              }}
            >
              <BsXSquare />
            </span>
          ) : (
            <></>
          )}
        </div>
        <div
          className={LayoutRefCSS.POPUP_CONTENTS}
          style={popupConfig.minContentHt ? { minHeight: popupConfig.minContentHt } : {}}
        >
          <PopupContent {...{ popup: popupConfig }} />
        </div>
      </div>
    </Layer>
  );
};
