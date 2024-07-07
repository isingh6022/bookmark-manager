import { ThemeColors } from '@proj-types';
import { getBorderCSS } from './css-gen-util.js';

export function getRightThemeCSS(rightBarColors: ThemeColors['rightColors']): string {
  return `

  div#right-sidebar-id {
    ${getBorderCSS(rightBarColors.borderLeftWidth, rightBarColors.borderLeftColor, 'left')}
  }
  div#right-sidebar-id #right-info-container-id {
  	background-color: ${rightBarColors.background};
  	color: ${rightBarColors.textColor};
  }
  div#right-sidebar-id #right-info-container-id svg {
  	color: ${rightBarColors.textColor};
  }
  `;
}
