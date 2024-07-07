import { ThemeColors } from '@proj-types';
import { getBorderCSS } from './css-gen-util.js';

export function getTopThemeCSS(topBarColors: ThemeColors['topColors']): string {
  return `

    #top-bar-id {
        background-color: ${topBarColors.background};
        ${getBorderCSS(topBarColors.borderBottomWidth, topBarColors.borderBottomColor, 'bottom')}
    }
    #top-bar-id svg {
        color: ${topBarColors.iconColor};
    }
    #top-bar-id #address-bar-id {
        ${
          topBarColors.addressBar.barBackground
            ? `background-color: ${topBarColors.addressBar.barBackground};`
            : ''
        }
        ${getBorderCSS(topBarColors.addressBar.borderWidth, topBarColors.addressBar.borderColor)}
    }
    #top-bar-id #address-bar-id #address-bar-element-container-id {
        ${getBorderCSS(
          topBarColors.addressBar.locationOrInputBorderWidth,
          topBarColors.addressBar.locationOrInputBorderColor
        )}
        background-color: ${topBarColors.addressBar.textBackground};
    }
    #top-bar-id #address-bar-id #address-bar-element-container-id .address-bar-element .address-bar-text-container {
        color: ${topBarColors.addressBar.textColor};
    }
    #top-bar-id #address-bar-id #address-bar-element-container-id .address-bar-element svg {
        color: ${topBarColors.addressBar.addressSeparatorColor};
    }
    #top-bar-id #address-bar-id #address-bar-element-container-id .address-bar-element #address-bar-home-button-container-id svg {
        color: ${topBarColors.addressBar.homeColor};
    }
    #top-bar-id #address-bar-id input {
        ${getBorderCSS(
          topBarColors.addressBar.locationOrInputBorderWidth,
          topBarColors.addressBar.locationOrInputBorderColor
        )}
        color: ${topBarColors.addressBar.textColor};
        background-color: ${topBarColors.addressBar.textBackground};
    }
    #top-bar-id #address-bar-id #address-bar-button-id svg {
        color: ${topBarColors.addressBar.searchColor};
    }
    #top-bar-id #page-buttons-id {
        background-color: ${topBarColors.pageButtons.background};
        ${getBorderCSS(topBarColors.pageButtons.borderWidth, topBarColors.pageButtons.borderColor)}
    }
    #top-bar-id #page-buttons-id svg {
        color: ${topBarColors.pageButtons.iconColor};
    }
    #top-bar-id #action-buttons-id {
        background-color: ${topBarColors.actionButtons.background};
        ${getBorderCSS(
          topBarColors.actionButtons.borderWidth,
          topBarColors.actionButtons.borderColor
        )}
    }
    #top-bar-id #action-buttons-id svg {
        color: ${topBarColors.actionButtons.iconColor};
    }
    #top-bar-id #state-buttons-id {
        background-color: ${topBarColors.stateButtons.background};
        ${getBorderCSS(
          topBarColors.stateButtons.borderWidth,
          topBarColors.stateButtons.borderColor
        )}
        ${getBorderCSS(
          topBarColors.stateActnBtnSeparatorWidth,
          topBarColors.stateActnBtnSeparatorColor,
          'left'
        )}
    }
    #top-bar-id #state-buttons-id svg {
        color: ${topBarColors.stateButtons.iconColor};
    }

  `;
}
