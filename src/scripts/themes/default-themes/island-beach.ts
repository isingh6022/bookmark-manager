import { ThemeColors } from '@proj-types';

const BLACK = '#000000';
const WHITE = '#FFFFFF';

const BORDR_0PX = '0px';
const BORDR_1PX = '1px';

const TOP_BG = '#0e414e';
const TOP_ICO = '#ecdecb';
const TOP_ICO_2 = '#385871';

const PAGE_BG = '#effbff';

const BORDR_COL_1 = '#003163';
const SECTION_BORDER_COL = '#6d442c';

export function getIslandBeachTheme() {
  let themeColors: ThemeColors = {
    topColors: {
      background: TOP_BG,
      iconColor: TOP_ICO,
      borderBottomWidth: BORDR_1PX,
      borderBottomColor: BLACK,
      addressBar: {
        textColor: BLACK,
        textBackground: PAGE_BG,
        locationOrInputBorderWidth: BORDR_1PX,
        locationOrInputBorderColor: BORDR_COL_1,
        addressSeparatorColor: BLACK,
        homeColor: TOP_ICO_2,
        searchColor: TOP_ICO_2,
        barBackground: TOP_BG,
        borderWidth: BORDR_0PX,
        borderColor: BLACK
      },
      pageButtons: {
        borderWidth: BORDR_0PX,
        borderColor: BLACK,
        background: TOP_BG,
        iconColor: TOP_ICO
      },
      actionButtons: {
        borderWidth: BORDR_0PX,
        borderColor: BLACK,
        background: TOP_BG,
        iconColor: TOP_ICO
      },
      stateButtons: {
        borderWidth: BORDR_0PX,
        borderColor: BLACK,
        background: TOP_BG,
        iconColor: TOP_ICO
      },
      stateActnBtnSeparatorWidth: '3px',
      stateActnBtnSeparatorColor: TOP_ICO_2
    },
    leftColors: {
      background: PAGE_BG,
      borderRightWidth: '2px',
      borderRightColor: SECTION_BORDER_COL,
      fixedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: '#c89c51',
        textColor: BLACK,
        borderWidthSelected: BORDR_1PX,
        borderColorSelected: BLACK,
        backgroundSelected: '#afa88c',
        textColorSelected: BLACK
      },
      pinnedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: '#deb978',
        textColor: BLACK,
        borderWidthSelected: BORDR_1PX,
        borderColorSelected: BLACK,
        backgroundSelected: '#afa88c',
        textColorSelected: BLACK
      }
    },
    middleColors: {
      background: '#ebf4ff',
      oddSubFolChContainerBgColor: WHITE,
      evenSubFolChContainerBgColor: '#f5e5d6',
      rootFolChContainerBgColor: WHITE,
      rootNodeContainerBorderWidth: '3px',
      rootNodeContainerBorderColor: '#ecc39d',
      folder: {
        textColor: '#6b3619',
        background: '#f9d076',
        borderColor: '#824d1c',
        borderWidth: BORDR_1PX,
        iconColor: '#aa7e50'
      },
      bookmark: {
        textColor: '#9c4211',
        background: WHITE,
        borderColor: '#824d1c',
        borderWidth: BORDR_1PX,
        iconColor: '#aa7e50'
      }
    },
    rightColors: {
      background: PAGE_BG,
      textColor: '#ced8df',
      borderLeftWidth: '2px',
      borderLeftColor: SECTION_BORDER_COL
    },
    popupColors: {
      topBar: '#3d638a',
      titleColor: WHITE,
      borderWidth: '2px',
      borderColor: BORDR_COL_1,
      borderTitleBottomWidth: BORDR_1PX,
      borderTitleBottomColor: BORDR_COL_1
    }
  };

  return themeColors;
}
