const DEFAULT_DATE = 0;

const ROOT_NODE_CONSTANTS = {
  id: Math.random() + '' + new Date().getTime(),
  url: '',
  title: '__ROOT__'
};
const SRH_REQ_DELAY = 700;

const DROP_DOWN_EMPTY = { key: '__NONE_SELECTED__', text: '' };

export { ROOT_NODE_CONSTANTS, DEFAULT_DATE, SRH_REQ_DELAY, DROP_DOWN_EMPTY };
