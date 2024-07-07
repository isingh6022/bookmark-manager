import { ThemeColors } from '@proj-types';

const BLACK = '#000000';
const WHITE = '#FFFFFF';
const BORDR_1PX = '1px';
const BORDR_0PX = '0px';

const TOP_BG = '#72661d';
const SECTION_BORDER = '#9c8a16';

const YELLOW1 = '#694d00';
const YELLOW2 = '#8d7f25';

export function getClassicYellowTheme() {
  let themeColors: ThemeColors = {
    topColors: {
      background: TOP_BG,
      iconColor: WHITE,
      borderBottomWidth: BORDR_0PX,
      borderBottomColor: BLACK,
      addressBar: {
        textColor: BLACK,
        textBackground: WHITE,
        locationOrInputBorderWidth: BORDR_1PX,
        locationOrInputBorderColor: '#8a8500',
        addressSeparatorColor: BLACK,
        homeColor: TOP_BG,
        searchColor: TOP_BG,
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
      stateActnBtnSeparatorWidth: '2px',
      stateActnBtnSeparatorColor: '#574b00'
    },
    leftColors: {
      background: WHITE,
      borderRightWidth: '3px',
      borderRightColor: SECTION_BORDER,
      fixedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: SECTION_BORDER,
        background: '#d7d4c1',
        textColor: YELLOW1,
        borderWidthSelected: '3px',
        borderColorSelected: YELLOW1,
        backgroundSelected: YELLOW2,
        textColorSelected: WHITE
      },
      pinnedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: SECTION_BORDER,
        background: WHITE,
        textColor: YELLOW1,
        borderWidthSelected: BORDR_1PX,
        borderColorSelected: YELLOW1,
        backgroundSelected: YELLOW2,
        textColorSelected: WHITE
      }
    },
    middleColors: {
      background: WHITE,
      oddSubFolChContainerBgColor: WHITE,
      evenSubFolChContainerBgColor: WHITE,
      rootFolChContainerBgColor: WHITE,
      rootNodeContainerBorderWidth: '3px',
      rootNodeContainerBorderColor: '#afa20d',
      folder: {
        textColor: BLACK,
        background: '#fff68f',
        borderColor: '#70630f',
        borderWidth: BORDR_1PX,
        iconColor: BLACK
      },
      bookmark: {
        textColor: BLACK,
        background: WHITE,
        borderColor: '#706115',
        borderWidth: BORDR_1PX,
        iconColor: BLACK
      }
    },
    rightColors: {
      background: WHITE,
      textColor: '#575005',
      borderLeftWidth: '3px',
      borderLeftColor: SECTION_BORDER
    },
    popupColors: {
      topBar: YELLOW2,
      titleColor: WHITE,
      borderWidth: '2px',
      borderColor: YELLOW1,
      borderTitleBottomWidth: '2px',
      borderTitleBottomColor: YELLOW1
    }
  };

  return themeColors;
}
