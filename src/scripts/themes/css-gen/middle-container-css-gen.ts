import { ThemeColors } from '@proj-types';
import { getBorderCSS } from './css-gen-util.js';

export function getMiddleThemeCSS(middleColors: ThemeColors['middleColors']): string {
  return `

    #middle-container-id {
        background-color: ${middleColors.background};
    }

    #bkmFolder-page-container-id, #search-or-recent-page-container-id {
        background-color: ${middleColors.background};
   }
    #bkmFolder-page-container-id>.node-ch-col>.folder, #bkmFolder-page-container-id>.node-ch-col>.bookmark,
    #search-or-recent-page-container-id>.node-ch-col>.folder, #search-or-recent-page-container-id>.node-ch-col>.bookmark {
        ${getBorderCSS(
          middleColors.rootNodeContainerBorderWidth,
          middleColors.rootNodeContainerBorderColor,
          'right'
        )}
   }
    #bkmFolder-page-container-id .node-ch-col.node-ch-col-root,
    #search-or-recent-page-container-id .node-ch-col.node-ch-col-root {
        ${'background-color: ${middleColors.rootFolChContainerBgColor}' && ''}
   }
    #bkmFolder-page-container-id>.node-ch-col:last-child>.folder,
    #bkmFolder-page-container-id>.node-ch-col:last-child>.bookmark,
    #search-or-recent-page-container-id>.node-ch-col:last-child>.folder,
    #search-or-recent-page-container-id>.node-ch-col:last-child>.bookmark {
        border-right: 0;
   }
    #bkmFolder-page-container-id .node-ch-col span.folder, #bkmFolder-page-container-id .node-ch-col div.folder > span,
    #search-or-recent-page-container-id .node-ch-col span.folder, #search-or-recent-page-container-id .node-ch-col div.folder > span {
        color: ${middleColors.folder.textColor};
        background-color: ${middleColors.folder.background};
        ${getBorderCSS(middleColors.folder.borderWidth, middleColors.folder.borderColor, 'bottom')}
   }
    #bkmFolder-page-container-id .node-ch-col span.folder svg, #bkmFolder-page-container-id .node-ch-col div.folder > span svg,
    #search-or-recent-page-container-id .node-ch-col span.folder svg, #search-or-recent-page-container-id .node-ch-col div.folder > span svg {
        color: ${middleColors.folder.iconColor};
   }
    #bkmFolder-page-container-id .node-ch-col div.folder > div.node-ch-col.node-ch-col-odd,
    #search-or-recent-page-container-id .node-ch-col div.folder > div.node-ch-col.node-ch-col-odd {
        background-color: ${middleColors.oddSubFolChContainerBgColor};
   }
    #bkmFolder-page-container-id .node-ch-col div.folder > div.node-ch-col.node-ch-col-even,
    #search-or-recent-page-container-id .node-ch-col div.folder > div.node-ch-col.node-ch-col-even {
        background-color: ${middleColors.evenSubFolChContainerBgColor};
   }
    #bkmFolder-page-container-id .node-ch-col .bookmark,
    #search-or-recent-page-container-id .node-ch-col .bookmark {
        color: ${middleColors.bookmark.textColor};
        background-color: ${middleColors.bookmark.background};
        ${getBorderCSS(
          middleColors.bookmark.borderWidth,
          middleColors.bookmark.borderColor,
          'bottom'
        )}
   }
    #bkmFolder-page-container-id .node-ch-col .bookmark svg,
    #search-or-recent-page-container-id .node-ch-col .bookmark svg {
        color: ${middleColors.bookmark.iconColor};
   }

    `;
}
