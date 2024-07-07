import { ConfirmPopup } from '@proj-types';
import { useDispatch } from 'react-redux';
import { AppDispatchType, confirm, popup as popupEvent } from '@proj-state';
import { PopupElementsRefCSS } from '@proj-const';

export const ConfirmPopupComponent: React.FC<ConfirmPopup> = (popup) => {
  const dispatch = useDispatch<AppDispatchType>();
  return (
    <div>
      <div>{popup.message}</div>
      <div id={PopupElementsRefCSS.POPUP_BTN_CONT_ID}>
        <button onClick={() => dispatch(confirm())}>{popup.confirmText || 'Confirm'}</button>
        <button onClick={() => dispatch(popupEvent(null))}>{popup.cancelText || 'Cancel'}</button>
      </div>
    </div>
  );
};
