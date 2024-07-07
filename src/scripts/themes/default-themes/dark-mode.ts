import { ThemeColors } from '@proj-types';

const BLACK = '#000000';
const WHITE = '#FFFFFF';

const BORDR_0PX = '0px';
const BORDR_1PX = '1px';

const TOP_BG = '#2f343c';
const PAGE_BG = '#6f7276';

export function getDarkTheme() {
  let themeColors: ThemeColors = {
    topColors: {
      background: TOP_BG,
      iconColor: WHITE,
      borderBottomWidth: BORDR_0PX,
      borderBottomColor: BLACK,
      addressBar: {
        textColor: WHITE,
        textBackground: '#484b51',
        locationOrInputBorderWidth: BORDR_0PX,
        locationOrInputBorderColor: '#003163',
        addressSeparatorColor: WHITE,
        homeColor: WHITE,
        searchColor: WHITE,
        barBackground: TOP_BG,
        borderWidth: BORDR_0PX,
        borderColor: BLACK
      },
      pageButtons: {
        borderWidth: BORDR_0PX,
        borderColor: BLACK,
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
      stateActnBtnSeparatorWidth: '3px',
      stateActnBtnSeparatorColor: '#4d5560'
    },
    leftColors: {
      background: PAGE_BG,
      borderRightWidth: '2px',
      borderRightColor: BLACK,
      fixedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: '#484b51',
        textColor: WHITE,
        borderWidthSelected: '2px',
        borderColorSelected: '#737373',
        backgroundSelected: TOP_BG,
        textColorSelected: WHITE
      },
      pinnedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: '#5d656f',
        textColor: WHITE,
        borderWidthSelected: BORDR_1PX,
        borderColorSelected: '#737373',
        backgroundSelected: TOP_BG,
        textColorSelected: WHITE
      }
    },
    middleColors: {
      background: PAGE_BG,
      oddSubFolChContainerBgColor: PAGE_BG,
      evenSubFolChContainerBgColor: '#57585c',
      rootFolChContainerBgColor: WHITE,
      rootNodeContainerBorderWidth: '3px',
      rootNodeContainerBorderColor: PAGE_BG,
      folder: {
        textColor: WHITE,
        background: '#3e4d60',
        borderColor: PAGE_BG,
        borderWidth: BORDR_1PX,
        iconColor: WHITE
      },
      bookmark: {
        textColor: WHITE,
        background: '#424448',
        borderColor: PAGE_BG,
        borderWidth: BORDR_1PX,
        iconColor: WHITE
      }
    },
    rightColors: {
      background: PAGE_BG,
      textColor: WHITE,
      borderLeftWidth: '2px',
      borderLeftColor: BLACK
    },
    popupColors: {
      topBar: TOP_BG,
      titleColor: WHITE,
      borderWidth: '2px',
      borderColor: TOP_BG,
      borderTitleBottomWidth: BORDR_1PX,
      borderTitleBottomColor: TOP_BG
    }
  };

  return themeColors;
}
