import { MODE, PAGES, Popup, TransientState } from '@proj-types';

export const initTransientState: TransientState = {
  visitedFolderIds: [],
  currPage: PAGES.bkmFolder,
  currMode: MODE.default,

  dragDrop: {
    dragging: false,
    dragstartNode: undefined,
    dragstartType: undefined
  },

  popup: null
  // {
  //   type: Popup.THEME,
  //   title: 'Themes',
  //   message: 'Themes popup.',
  //   width: 500,
  //   minContentHt: 300,
  //   closeOnOutsideClick: true
  // }
};
