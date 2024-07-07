const DEFAULT_BKM_PG_FOL_COL_COUNT = 3;

type _STORE_KEY_TYPE =
  | 'icons'
  | 'pins'
  | 'homePin'
  | 'themes'
  | 'currTheme'
  | 'groupBkmFol'
  | 'showFolBkmIcons'
  | 'flowDirection'
  | 'notice'
  | 'colCount';

type _STORAGE_DATA_OBJECT<T = any> = { [k in _STORE_KEY_TYPE]: T };

const STORE_KEYS: _STORAGE_DATA_OBJECT<_STORE_KEY_TYPE> = {
  icons: 'icons',
  pins: 'pins',
  homePin: 'homePin',
  themes: 'themes',
  currTheme: 'currTheme',
  groupBkmFol: 'groupBkmFol',
  showFolBkmIcons: 'showFolBkmIcons',
  flowDirection: 'flowDirection',
  notice: 'notice',
  colCount: 'colCount'
};

const ALL_STORE_KEYS: _STORE_KEY_TYPE[] = (() => {
  let arr: _STORE_KEY_TYPE[] = [];
  for (let key in STORE_KEYS) {
    arr.push(<_STORE_KEY_TYPE>key);
  }
  return arr;
})();

const DO_NOT_SHOW_VERSION_INFO = '__version_10.0.0_update_info_is_not_to_be_shown__';

const ERR_MOVE_WITHIN_SELF = new Error('Trying to move a folder within itself...');

const NOT_SUPPORTED_FLAG = '__not__supported__';

const DEFAULT_ROOT_NODE_TITLE = '[Unnamed Root]';

const CONSECUTIVE_STORAGE_UPDATE_DELAY = 100; // ms.

export {
  STORE_KEYS,
  DO_NOT_SHOW_VERSION_INFO,
  ERR_MOVE_WITHIN_SELF,
  ALL_STORE_KEYS,
  NOT_SUPPORTED_FLAG,
  _STORE_KEY_TYPE,
  _STORAGE_DATA_OBJECT,
  DEFAULT_BKM_PG_FOL_COL_COUNT,
  CONSECUTIVE_STORAGE_UPDATE_DELAY,
  DEFAULT_ROOT_NODE_TITLE
};
