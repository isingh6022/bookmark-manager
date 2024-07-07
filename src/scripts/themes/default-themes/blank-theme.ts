import { ThemeColors } from '@proj-types';

const BLACK = '#000000';
const WHITE = '#FFFFFF';
const BORDR_1PX = '1px';

export function getBlankTheme() {
  let themeColors: ThemeColors = {
    topColors: {
      background: WHITE,
      iconColor: BLACK,
      borderBottomWidth: BORDR_1PX,
      borderBottomColor: BLACK,

      addressBar: {
        textColor: BLACK,
        textBackground: WHITE,
        locationOrInputBorderWidth: BORDR_1PX,
        locationOrInputBorderColor: BLACK,

        addressSeparatorColor: BLACK,
        homeColor: BLACK,
        searchColor: BLACK,

        barBackground: WHITE,
        borderWidth: BORDR_1PX,
        borderColor: BLACK
      },
      pageButtons: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: WHITE,
        iconColor: BLACK
      },
      actionButtons: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: WHITE,
        iconColor: BLACK
      },
      stateButtons: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: WHITE,
        iconColor: BLACK
      },
      stateActnBtnSeparatorWidth: '2px',
      stateActnBtnSeparatorColor: BLACK
    },
    leftColors: {
      background: WHITE,
      borderRightWidth: BORDR_1PX,
      borderRightColor: BLACK,

      fixedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: WHITE,
        textColor: BLACK,

        borderWidthSelected: BORDR_1PX,
        borderColorSelected: BLACK,
        backgroundSelected: WHITE,
        textColorSelected: BLACK
      },
      pinnedFolders: {
        borderWidth: BORDR_1PX,
        borderColor: BLACK,
        background: WHITE,
        textColor: BLACK,

        borderWidthSelected: BORDR_1PX,
        borderColorSelected: BLACK,
        backgroundSelected: WHITE,
        textColorSelected: BLACK
      }
    },
    middleColors: {
      background: WHITE,

      oddSubFolChContainerBgColor: WHITE,
      evenSubFolChContainerBgColor: WHITE,
      rootFolChContainerBgColor: WHITE,
      rootNodeContainerBorderWidth: BORDR_1PX,
      rootNodeContainerBorderColor: BLACK,

      folder: {
        textColor: BLACK,
        background: WHITE,
        borderColor: BLACK,
        borderWidth: BORDR_1PX,
        iconColor: BLACK
      },
      bookmark: {
        textColor: BLACK,
        background: WHITE,
        borderColor: BLACK,
        borderWidth: BORDR_1PX,
        iconColor: BLACK
      }
    },
    rightColors: {
      background: WHITE,
      textColor: BLACK,
      borderLeftWidth: BORDR_1PX,
      borderLeftColor: BLACK
    },
    popupColors: {
      topBar: BLACK,
      titleColor: WHITE,
      borderWidth: BORDR_1PX,
      borderColor: BLACK,
      borderTitleBottomWidth: BORDR_1PX,
      borderTitleBottomColor: BLACK
    }
  };

  return themeColors;
}
