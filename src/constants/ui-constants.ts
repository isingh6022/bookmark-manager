const MIN_NODES_PER_ROW = 5;

/**
 * This constant should take into account the animation duration.
 * It should be more than the css animation time, but not too long.
 */
const SUBFOLDER_HEIGHT_CHANGE_DELAY = 150;

/**
 * This constant should be the same as the node height in the scss file.
 */
const NODE_HEIGHT_REM = 1.4; // rem

const CTX_MENU_TOLLERANCE = {
  Right: 14, // rem - taken from start to right edge.
  Bottom: 1 // rem - from bottom edge to screen end.
};

const DRAG_START_THRESHOLD_REM = 0.2; // rem
const DRAG_START_THRESHOLD_PIX = 4; // rem

const DRAG_OVER_TOP_BOT_TOLLERANCE_REM = 0.4; // rem
const DRAG_OVER_LFT_RGT_TOLLERANCE_REM = 2.5; // rem

const SHIFT_DRAG_EL = {
  x: 0.15, // rem
  y: -NODE_HEIGHT_REM / 1.5 // rem
};

const SCROLL = {
  REM_PER_SEC: 50,
  STEP_SIZE_REM: 1,

  TOP_LIM_REM: 0.1,
  BOT_LIM_REM: 0.93
};

const TIPS = {
  FLOW_DIR: 'Whether to fill columns first or rows first.',
  DISP_ORDER: 'Whether to group / sort folders and bookmarks or not.',
  NEW_FOLDER: 'Create a new sub folder within current folder.',
  EDIT_MODE: 'Select and move multiple bookmarks.',
  EXIT_SEARCH: 'Close search.',
  SEARCH: 'Search for bookmarks.',
  HOME: 'Go to the main bookmark folder.',
  RECENT: 'Show recently added bookmarks.',
  DUPLICATES: 'Show duplicate bookmarks.',
  SETTINGS: 'Change settings.',
  THEME: 'Change existing theme or create new or set default.'
};

const THEME_CONST = {
  defaults: {
    unnamed: '__unnamed_theme__',
    defaultTheme: ''
  },
  blankTheme: {
    name: 'EMPTY',
    id: '__blank_theme__'
  },
  classicYellow: {
    name: 'Classic Yellow',
    id: '__classic_yellow__'
  },
  islandBeach: {
    name: 'Island Beach',
    id: '__island_beach__'
  },
  teal: {
    name: 'Teal',
    id: '__teal__'
  },
  dark: {
    name: 'Dark Mode',
    id: '__dark_mode__'
  },
  permanentThemeIds: new Set<string>([])
};

THEME_CONST.defaults.defaultTheme = THEME_CONST.classicYellow.id;

THEME_CONST.permanentThemeIds.add(THEME_CONST.blankTheme.id);
THEME_CONST.permanentThemeIds.add(THEME_CONST.classicYellow.id);
THEME_CONST.permanentThemeIds.add(THEME_CONST.islandBeach.id);
THEME_CONST.permanentThemeIds.add(THEME_CONST.teal.id);

export {
  MIN_NODES_PER_ROW,
  SUBFOLDER_HEIGHT_CHANGE_DELAY,
  NODE_HEIGHT_REM,
  CTX_MENU_TOLLERANCE,
  DRAG_START_THRESHOLD_REM,
  DRAG_START_THRESHOLD_PIX,
  DRAG_OVER_TOP_BOT_TOLLERANCE_REM,
  DRAG_OVER_LFT_RGT_TOLLERANCE_REM,
  SHIFT_DRAG_EL,
  TIPS,
  THEME_CONST,
  SCROLL
};
