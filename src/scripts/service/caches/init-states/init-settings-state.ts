import { DEFAULT_BKM_PG_FOL_COL_COUNT } from '@proj-const';
import { ThemeHelper } from '../../../themes/theme-helper.js';
import { RetainedState, FLOW, BKM_DISPLAY_ORDER } from '@proj-types';

const currTheme = ThemeHelper.getDefaultThemes()[0]!;
export const initSettingsState: RetainedState = {
  flowDirection: FLOW.Col,
  bkmDisplayOrder: BKM_DISPLAY_ORDER.default,
  pinnedFolders: [],
  bkmFolderColCount: DEFAULT_BKM_PG_FOL_COL_COUNT,
  themes: [currTheme],
  currTheme
};
