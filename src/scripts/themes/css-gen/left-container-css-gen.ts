import { ThemeColors } from '@proj-types';
import { getBorderCSS } from './css-gen-util.js';

export function getLeftThemeCSS(leftBarColors: ThemeColors['leftColors']): string {
  return `

  #left-sidebar-id > div {
    background-color: ${leftBarColors.background};
    ${getBorderCSS(leftBarColors.borderRightWidth, leftBarColors.borderRightColor, 'right')}
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder {
    background-color: ${leftBarColors.pinnedFolders.background};
    ${getBorderCSS(
      leftBarColors.pinnedFolders.borderWidth,
      leftBarColors.pinnedFolders.borderColor
    )}
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder * {
    color: ${leftBarColors.pinnedFolders.textColor};
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder #context-menu * {
    color: ${leftBarColors.pinnedFolders.textColor};
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder.pinned-folder-selected {
    background-color: ${leftBarColors.pinnedFolders.backgroundSelected};
    ${getBorderCSS(
      leftBarColors.pinnedFolders.borderWidthSelected,
      leftBarColors.pinnedFolders.borderColorSelected
    )}
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder.pinned-folder-selected * {
    color: ${leftBarColors.pinnedFolders.textColorSelected};
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder.non-removable-pinned-folder {
    background-color: ${leftBarColors.fixedFolders.background};
    ${getBorderCSS(leftBarColors.fixedFolders.borderWidth, leftBarColors.fixedFolders.borderColor)}
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder.non-removable-pinned-folder * {
    color: ${leftBarColors.fixedFolders.textColor};
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder.non-removable-pinned-folder.pinned-folder-selected {
    background-color: ${leftBarColors.fixedFolders.backgroundSelected};
    ${getBorderCSS(
      leftBarColors.fixedFolders.borderWidthSelected,
      leftBarColors.fixedFolders.borderColorSelected
    )}
  }
  #left-sidebar-id .pinned-folder-container .pinned-folder.non-removable-pinned-folder.pinned-folder-selected * {
    color: ${leftBarColors.fixedFolders.textColorSelected};
  }
  `;
}
