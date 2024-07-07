enum LayoutRefCSS {
  OVR_LAY = 'fullscreen-overlay',

  TOP_BAR_ID = 'top-bar-id',
  SIDEBAR_LT_ID = 'left-sidebar-id',
  MIDDLE_CONT_ID = 'middle-container-id',
  SIDEBAR_RT_ID = 'right-sidebar-id',

  CTX_MENU_ID = 'context-menu',
  CTX_MENU_SHIFT_LEFT = 'shift-left',
  CTX_MENU_SHIFT_UP = 'shift-up',

  POPUP = 'popup',
  POPUP_TITLE = 'popup-title',
  POPUP_CONTENTS = 'popup-contents'
}

enum PageRefCSS {
  DUPLICATES_CONT_ID = 'duplicates-page-container-id',
  SEARCH_OR_RECENT_CONT_ID = 'search-or-recent-page-container-id',
  BOOKMARK_CONT_ID = 'bkmFolder-page-container-id'
}

enum ComponentRefCSS {
  PAGE_BTN_ID = 'page-buttons-id',
  ADDR_BAR_ID = 'address-bar-id',
  ACTN_BTN_ID = 'action-buttons-id',
  STAT_BTN_ID = 'state-buttons-id',

  DUP_CONTROLS = 'duplicates-controls',
  DUP_DELETE_BTN = 'delete-duplicates',
  DRG_DRP_ELEM_ID = 'drag-drop-element',

  RT_INFO_CONT_ID = 'right-info-container-id'
}

enum MinorElementsRefCSS {
  ADDR_BAR_ICON_CONT = 'address-bar-icon-container',

  PIN_FOL_CONT = 'pinned-folder-container',
  PIN_FOL = 'pinned-folder',
  PIN_FOL_HOME = 'home-pinned-folder',
  PIN_FOL_NON_RMV = 'non-removable-pinned-folder',
  PIN_RMV_BTN = 'remove-pin-button',
  PIN_FOL_SEL = 'pinned-folder-selected',
  PIN_FOL_TIP = 'pin-folders-tip',

  NOD_CH_COL = 'node-ch-col',
  NOD_CH_COL_ROW_FLOW = 'node-ch-col-row-flow',
  NOD_CH_ROOT = 'node-ch-col-root',
  NOD_CH_ODD = 'node-ch-col-odd',
  NOD_CH_EVN = 'node-ch-col-even',
  NOD_BKM = 'bookmark',
  NOD_FOL = 'folder',
  NOD_SEL = 'node-selected',
  FOL_COLLAPSED = 'folder-collapsed',
  FOL_EXPANDED = 'folder-expanded',

  DUP_NOD_GROUP = 'duplicates-group',
  DUP_NOD = 'duplicate-node',
  DUP_NOD_PARENT_CHAIN = 'parent-chain',
  DUP_NOD_LINK = 'duplicate-node-link',

  ADDR_BAR_ADDR_ELEM = 'address-bar-element',
  ADDR_BAR_ELEM_CONT_ID = 'address-bar-element-container-id',
  ADDR_BAR_HOME_BTN_ID = 'address-bar-home-button-container-id',
  ADD_BAR_TEXT_CONT = 'address-bar-text-container',
  ADDR_BAR_BTN_ID = 'address-bar-button-id',

  EDIT_BTN_EDITING = 'edit-btn-editing',

  INPUT_CONT = 'input-container',
  INPUT_CONT_JUSTIFY_START = 'input-container-justify-start',
  // INPUT_LABL = 'input-label', // use tags instead.
  // INPUT_INPT = 'input-input', // use tags instead.
  INPUT_RADIO_CONT = 'input-radio-container',
  INPUT_RADIO_TITLE = 'input-radio-title',
  INPUT_RADIO_BTN_CONT = 'input-radio-buttons-container',

  FIELD_GROUP_CONT = 'field-group-container',
  FIELD_GROUP_BOXED = 'field-group-boxed',
  FIELD_GROUP_TITLE = 'field-group-container-title',
  FIELD_GROUP_FIELDS = 'field-group-fields-container',
  FORM_ELEMENTS_CONT = 'form-elements-container'
}

enum PopupElementsRefCSS {
  INF_MSG_CONT_ID = 'inf-msg-popup-container-id',
  ERR_MSG_CONT_ID = 'err-msg-popup-container-id',
  WARNING_CONT_ID = 'warning-popup-container-id',
  SUCCESS_CONT_ID = 'success-popup-container-id',
  CONFIRM_CONT_ID = 'confirm-popup-container-id',
  SETTING_CONT_ID = 'setting-popup-container-id',
  NEW_FOL_CONT_ID = 'new-fol-popup-container-id',
  PROPERS_CONT_ID = 'properties-popup-container-id',
  THEME_CONT_ID = 'theme-popup-container-id',

  POPUP_BTN_CONT_ID = 'popup-button-container-id',

  // Other ids / classes only for popups...
  THEME_FIELD_FORM_ID = 'theme-field-form-id',
  THEME_POPUP_WARN = 'theme-field-warning'
}

enum GenericClassCSS {
  FLEX_ROW_CENTER_NOWRAP = 'flex-row-center-nowrap',
  FLEX_J_START = 'flex-justify-start',
  FLEX_J_CENTER = 'flex-justify-center',
  FLEX_J_END = 'flex-justify-end',
  FLEX_J_BET = 'flex-justify-between',

  UNSELECTABLE = 'unselectable',
  ANIMATED = 'animated',
  ROT_90_ANTI_CLOC = 'rotate-90-anti-cloc',
  ROT_90_CLOC = 'rotate-90-cloc'
}

enum DragDropClassCSS {
  OVER = 'dragover',
  DRAGGING = 'dragging',

  TOP = 'dragover-top',
  BOT = 'dragover-bottom',
  LFT = 'dragover-left',
  RGT = 'dragover-right',
  MID = 'dragover-middle'
}

const DRAG_DROP_CLASS_LIST = (() => {
  let arr: DragDropClassCSS[] = [];

  const allDragClasses: { [key in DragDropClassCSS]: DragDropClassCSS } = {
    [DragDropClassCSS.OVER]: DragDropClassCSS.OVER,
    [DragDropClassCSS.TOP]: DragDropClassCSS.TOP,
    [DragDropClassCSS.BOT]: DragDropClassCSS.BOT,
    [DragDropClassCSS.LFT]: DragDropClassCSS.LFT,
    [DragDropClassCSS.RGT]: DragDropClassCSS.RGT,
    [DragDropClassCSS.MID]: DragDropClassCSS.MID,
    [DragDropClassCSS.DRAGGING]: DragDropClassCSS.DRAGGING
  };

  for (const key in allDragClasses) {
    arr.push((<any>allDragClasses)[key]);
  }

  return arr;
})();

export {
  LayoutRefCSS,
  PageRefCSS,
  ComponentRefCSS,
  GenericClassCSS,
  MinorElementsRefCSS,
  DragDropClassCSS,
  PopupElementsRefCSS,
  DRAG_DROP_CLASS_LIST
};
