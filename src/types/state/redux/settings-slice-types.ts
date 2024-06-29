import { Theme } from '../../theme/types-theme.js';

enum Flow {
  ROW = 'row',
  COL = 'col'
}

enum BkmDisplayOrder {
  DEFAULT,
  GROUP_AND_SORT
}

interface RetainedState {
  flowDirection: Flow;
  bkmDisplayOrder: BkmDisplayOrder;
  pinnedFolders: { id: string; title: string; removable: boolean }[];
  bkmFolderColCount: number;
  homeFolder?: string;
  themes: Theme[];
  currTheme: Theme;
}

export { Flow, BkmDisplayOrder };
export type { RetainedState };
