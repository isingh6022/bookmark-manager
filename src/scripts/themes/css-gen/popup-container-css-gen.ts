import { ThemeColors } from '@proj-types';
import { getBorderCSS } from './css-gen-util.js';

export function getPopupThemeCSS(popupColors: ThemeColors['popupColors']): string {
  return `
    div.popup {
      ${getBorderCSS(popupColors.borderWidth, popupColors.borderColor)};
      background-color: ${popupColors.topBar};
    }

    div.popup .popup-title {
      ${getBorderCSS(
        popupColors.borderTitleBottomWidth,
        popupColors.borderTitleBottomColor,
        'bottom'
      )}
    }
    div.popup .popup-title,
    div.popup .popup-title * {
      background-color: ${popupColors.topBar};
      color: ${popupColors.titleColor};
    }
    `;
}
