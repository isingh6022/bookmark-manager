import { DEFAULT_BKM_PG_FOL_COL_COUNT } from '@proj-const';
import { ThemeHelper } from '../../../themes/theme-helper.js';
import { RetainedState, Flow, BkmDisplayOrder } from '@proj-types';

const currTheme = ThemeHelper.getDefaultThemes()[0]!;
export const initSettingsState: RetainedState = {
  flowDirection: Flow.COL,
  bkmDisplayOrder: BkmDisplayOrder.DEFAULT,
  pinnedFolders: [],
  bkmFolderColCount: DEFAULT_BKM_PG_FOL_COL_COUNT,
  themes: [currTheme],
  currTheme
};
