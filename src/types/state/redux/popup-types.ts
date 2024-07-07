import { BookmarkTreeDataNode } from '../../data/node.js';

// prettier-ignore
enum Popup { INFO, ERROR, WARN, SUCCESS, CONFIRM, SETTINGS, PROPERTIES, NEW_FOL, THEME }

interface PopupConfig {
  type: Popup;
  title: string;
  message: string;
  width: number;
  minContentHt?: number;
  closeOnOutsideClick?: boolean | Function;
  popupId?: string;
  background?: { color: string } | 'transparent';
}

interface InfoPopup extends PopupConfig {
  type: Popup.INFO;
}
interface ErrorPopup extends PopupConfig {
  type: Popup.ERROR;
}
interface WarnPopup extends PopupConfig {
  type: Popup.WARN;
}
interface SuccessPopup extends PopupConfig {
  type: Popup.SUCCESS;
}
interface ConfirmPopup extends PopupConfig {
  type: Popup.CONFIRM;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}
interface SettingsPopup extends PopupConfig {
  type: Popup.SETTINGS;
}
interface PropertiesPopup extends PopupConfig {
  nodeId: string;
  node: BookmarkTreeDataNode;
  parentChain: BookmarkTreeDataNode[];
  folderStats: { nFol: number; nBkm: number };
}
interface NewFolderPopup extends PopupConfig {
  type: Popup.NEW_FOL;
  parentId: string; // Sent when the event is fired.
  parentChain: BookmarkTreeDataNode[];
  parentNode: BookmarkTreeDataNode;
}
interface ThemePopup extends PopupConfig {
  type: Popup.THEME;
}

// prettier-ignore
export { 
  Popup, PopupConfig,
  InfoPopup, ErrorPopup, WarnPopup, SuccessPopup,
  ConfirmPopup, SettingsPopup, PropertiesPopup,
  NewFolderPopup, ThemePopup
};
