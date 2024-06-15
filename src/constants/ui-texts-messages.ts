const LOCAL_LINK_INFO =
  'This link is for a local file / folder on system. Use right click to open it.';

enum CommonCtxMenuOptions {
  RNM = 'Rename',
  DIFF_NAME_BKM_BAR = 'Change Top Bar Name',
  SHW_PRNT_FOL = 'Show in Parent Folder',
  SHW_ROOT_FOL = 'Show in Root Folder',
  SHW_PROPS = 'Show Properties',
  OPEN_LOCATION = 'Open Bookmark Location',
  MOV = 'Move to Folder',
  DEL = 'Delete'
}
enum FolCtxMenuOptions {
  EXPAND = 'Expand',
  COLLAPSE = 'Collapse',
  OPEN_FULL = 'Open in Full View',
  PIN = 'Pin to Side Bar'
}

enum PinCtxMenuOptions {
  SET_HOME = 'Set as Home',
  MV_TOP = 'Move to Top',
  MV_BOT = 'Move to Bottom',
  RMV = 'Remove'
}

enum BkmCtxMenuOptions {
  OPEN_NEW_TAB = 'Open in New Tab',
  EDIT = 'Edit',
  CPY_TO_FOL = 'Copy to Folder',
  SHW_FUL_NAM_OF_ICO = 'Show full name',
  ICN_ONLY_TOP_BAR = 'Icon Only in Top Bar'
}

export {
  LOCAL_LINK_INFO,
  CommonCtxMenuOptions,
  PinCtxMenuOptions,
  FolCtxMenuOptions,
  BkmCtxMenuOptions
};
