import { useDispatch } from 'react-redux';
import { CtxMenuOption, Popup, PinCtxMenuProps, PropertiesPopup } from '@proj-types';
import { AppDispatchType, homePin, setPins, unpin, popup } from '@proj-state';
import { CommonCtxMenuOptions, PinCtxMenuOptions } from '@proj-const';
import { CtxMenu } from './context-menu.js';

type ReduxEvent =
  | ReturnType<typeof homePin>
  | ReturnType<typeof setPins>
  | ReturnType<typeof unpin>
  | ReturnType<typeof popup>;

type Pin = PinCtxMenuProps['pin'];

export const PinCtxMenu: React.FC<PinCtxMenuProps> = ({ pin, position, closeMenu }) => {
  const options: CtxMenuOption[] = [];

  const dispatch = useDispatch<AppDispatchType>();
  const addOption = (title: string, event: ReduxEvent) => {
    options.push({ title, onClick: () => dispatch(event) });
  };

  // set as home
  addOption(PinCtxMenuOptions.SET_HOME, homePin(pin.id));

  // move to top
  // pin.removable && addOption(PinCtxMenuOptions.MV_TOP, setPins(reorderPins(allPins, true)));

  // move to bottom
  // pin.removable && addOption(PinCtxMenuOptions.MV_BOT, setPins(reorderPins(allPins, false)));

  // show properties
  addOption(
    CommonCtxMenuOptions.SHW_PROPS,
    popup({
      type: Popup.PROPERTIES,
      title: '', // Determined by popup.
      message: '',
      width: 450,
      closeOnOutsideClick: true,
      nodeId: pin.id
    } as PropertiesPopup)
  );

  // remove
  pin.removable && addOption(PinCtxMenuOptions.RMV, unpin(pin.id));

  return <CtxMenu {...{ position, options, closeMenu }} />;
};
