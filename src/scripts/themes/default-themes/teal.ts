import { ThemeColors } from '@proj-types';

const BLACK = '#000000';
const WHITE = '#FFFFFF';
const BORDR_0PX = '0px';
const BORDR_1PX = '1px';

const TOP_BG = '#286a5c';
const PAGE_BG = '#f5fffe';

const BORDER_COL_1 = '#1c4d40';
const DARK_TEAL_1 = '#163d33';

export function getTealTheme() {
  let themeColors: ThemeColors = {
    topColors: {
      background: TOP_BG,
      iconColor: WHITE,
      borderBottomWidth: BORDR_0PX,
      borderBottomColor: BORDER_COL_1,
      addressBar: {
        textColor: BLACK,
        textBackground: WHITE,
        locationOrInputBorderWidth: BORDR_1PX,
        locationOrInputBorderColor: BORDER_COL_1,
        addressSeparatorColor: BLACK,
        homeColor: TOP_BG,
        searchColor: TOP_BG,
        barBackground: TOP_BG,
        borderWidth: BORDR_0PX,
        borderColor: BLACK
      },
      pageButtons: {
        borderWidth: BORDR_0PX,
        borderColor: '#4d4600',
        background: TOP_BG,
        iconColor: WHITE
      },
      actionButtons: {
        borderWidth: BORDR_0PX,
        borderColor: BLACK,
        background: TOP_BG,
        iconColor: WHITE
      },
      stateButtons: {
        borderWidth: BORDR_0PX,
        borderColor: BLACK,
        background: TOP_BG,
        iconColor: WHITE
      },
      stateActnBtnSeparatorWidth: '2px',
      stateActnBtnSeparatorColor: BORDER_COL_1
    },
    leftColors: {
      background: PAGE_BG,
      borderRightWidth: '3px',
      borderRightColor: BORDER_COL_1,
      fixedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: BORDER_COL_1,
        background: '#aae3dc',
        textColor: DARK_TEAL_1,
        borderWidthSelected: '3px',
        borderColorSelected: DARK_TEAL_1,
        backgroundSelected: '#174d50',
        textColorSelected: WHITE
      },
      pinnedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: BORDER_COL_1,
        background: '#dcf9f6',
        textColor: DARK_TEAL_1,
        borderWidthSelected: BORDR_1PX,
        borderColorSelected: DARK_TEAL_1,
        backgroundSelected: '#174d50',
        textColorSelected: WHITE
      }
    },
    middleColors: {
      background: WHITE,
      oddSubFolChContainerBgColor: '#e5f5f3',
      evenSubFolChContainerBgColor: WHITE,
      rootFolChContainerBgColor: WHITE,
      rootNodeContainerBorderWidth: '3px',
      rootNodeContainerBorderColor: '#83aaa6',
      folder: {
        textColor: BORDER_COL_1,
        background: '#cbfbf5',
        borderColor: BORDER_COL_1,
        borderWidth: BORDR_1PX,
        iconColor: BORDER_COL_1
      },
      bookmark: {
        textColor: BORDER_COL_1,
        background: WHITE,
        borderColor: BORDER_COL_1,
        borderWidth: BORDR_1PX,
        iconColor: BORDER_COL_1
      }
    },
    rightColors: {
      background: PAGE_BG,
      textColor: BORDER_COL_1,
      borderLeftWidth: '3px',
      borderLeftColor: BORDER_COL_1
    },
    popupColors: {
      topBar: TOP_BG,
      titleColor: WHITE,
      borderWidth: '2px',
      borderColor: BORDER_COL_1,
      borderTitleBottomWidth: '2px',
      borderTitleBottomColor: BORDER_COL_1
    }
  };

  return themeColors;
}
