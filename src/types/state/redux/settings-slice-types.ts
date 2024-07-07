import { Theme } from '../../theme/types-theme.js';

enum FLOW {
  Row = 'row',
  Col = 'col'
}

enum BKM_DISPLAY_ORDER {
  default,
  groupAndSort
}

interface RetainedState {
  flowDirection: FLOW;
  bkmDisplayOrder: BKM_DISPLAY_ORDER;
  pinnedFolders: { id: string; title: string; removable: boolean }[];
  bkmFolderColCount: number;
  homeFolder?: string;
  themes: Theme[];
  currTheme: Theme;
}

export { FLOW, BKM_DISPLAY_ORDER };
export type { RetainedState };
