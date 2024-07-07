import {
  MinorElementsRefCSS,
  LayoutRefCSS,
  PageRefCSS,
  DragDropClassCSS,
  DRAG_OVER_LFT_RGT_TOLLERANCE_REM,
  DRAG_OVER_TOP_BOT_TOLLERANCE_REM
} from '@proj-const';
import { MiscUtil } from './misc-util.js';
import { DragoverOrDropType, DragstartType, DropZone, NodeType, TransientState } from '@proj-types';

export class DragDrop {
  static getPopupTitle(el: HTMLElement): HTMLElement | null {
    return el.classList.contains('popup-title')
      ? el
      : el.parentElement!.classList.contains('popup-title')
        ? el.parentElement
        : null;
  }
  static getBookmarkElement(el: HTMLElement): HTMLElement | null {
    return el.classList && el.classList.contains(MinorElementsRefCSS.NOD_BKM) ? el : null;
  }
  static getFolderElement(el: HTMLElement): HTMLElement | null {
    return el.classList && el.classList.contains(MinorElementsRefCSS.NOD_FOL)
      ? el
      : el.parentElement && el.parentElement.classList.contains(MinorElementsRefCSS.NOD_FOL)
        ? el.parentElement
        : null;
  }
  static getPinnedFolderElement(el: HTMLElement): HTMLElement | null {
    return el.classList && el.classList.contains(MinorElementsRefCSS.PIN_FOL)
      ? el
      : el.parentElement && el.parentElement.classList.contains(MinorElementsRefCSS.PIN_FOL)
        ? el.parentElement
        : null;
  }
  static getPinContainerParent(el: HTMLElement): HTMLElement | null {
    let parent: HTMLElement | null = null;

    while (el.parentElement) {
      if (el.id === LayoutRefCSS.SIDEBAR_LT_ID) {
        parent = el;
        break;
      }
      el = el.parentElement;
    }

    return parent;
  }
  static getBkmPageContainerParent(el: HTMLElement): HTMLElement | null {
    let parent: HTMLElement | null = null;

    while (el.parentElement) {
      if (el.id === PageRefCSS.BOOKMARK_CONT_ID) {
        parent = el;
        break;
      }
      el = el.parentElement;
    }

    return parent && parent.id === PageRefCSS.BOOKMARK_CONT_ID ? parent : null;
  }
  static isFolderOrBkmElement(el: HTMLElement): boolean {
    return !!(DragDrop.getBookmarkElement(el) || DragDrop.getFolderElement(el));
  }
  static isFolderElement(el: HTMLElement): boolean {
    return !!DragDrop.getFolderElement(el);
  }

  static getDragnodeDetails(el: HTMLElement): TransientState['dragDrop']['dragstartNode'] | null {
    let nodeType: NodeType | null = el.classList.contains(MinorElementsRefCSS.NOD_BKM)
      ? NodeType.BKM
      : el.classList.contains(MinorElementsRefCSS.NOD_FOL)
        ? NodeType.FOL
        : null;

    if (nodeType === null) {
      return null;
    }

    let id = MiscUtil.getBkmFolNodeIdFromEl(el),
      type = nodeType,
      title = el.textContent || '';

    return { id, type, title };
  }
  static getDropnodeDetails(el: HTMLElement): TransientState['dragDrop']['dragstartNode'] | null {
    return DragDrop.getDragnodeDetails(el);
  }
  static getDragpinDetails(el: HTMLElement): TransientState['dragDrop']['dragstartNode'] | null {
    let id = MiscUtil.getPinFolIdFromEl(el),
      title = el.firstChild!.textContent || '',
      type: NodeType = NodeType.FOL;

    return { id, title, type };
  }
  static isFixedPin(el: HTMLElement): boolean {
    return el.classList.contains(MinorElementsRefCSS.PIN_FOL_NON_RMV);
  }

  static isInRowFlow(el: HTMLElement): boolean {
    if (!el.parentElement) return false;
    return el.parentElement.classList.contains(MinorElementsRefCSS.NOD_CH_COL_ROW_FLOW);
  }

  /**
   * Returns the "Zone" in which the cursor is currently located (top, bottom, left,
   *    right or middle).
   * The following method assumes that the cursor is inside the element.
   */
  static getDragZone(e: MouseEvent, targetEl?: HTMLElement): DropZone | null {
    let rect = (targetEl || (e.target as HTMLElement)).getBoundingClientRect();

    let pxTopBotToll = MiscUtil.remToPx(DRAG_OVER_TOP_BOT_TOLLERANCE_REM),
      pxLftRgtToll = MiscUtil.remToPx(DRAG_OVER_LFT_RGT_TOLLERANCE_REM),
      pxTop = e.clientY - Math.floor(rect.top),
      pxLft = e.clientX - Math.floor(rect.left);

    const insideBox =
      pxTop >= 0 && pxTop <= Math.ceil(rect.height) && pxLft > 0 && pxLft < Math.ceil(rect.width);

    if (!insideBox) {
      return null;
    }

    let topBot =
      pxTop < pxTopBotToll
        ? DragDropClassCSS.TOP
        : rect.height - pxTop < pxTopBotToll
          ? DragDropClassCSS.BOT
          : null;
    let lftRgt =
      pxLft < pxLftRgtToll
        ? DragDropClassCSS.LFT
        : rect.width - pxLft < pxLftRgtToll
          ? DragDropClassCSS.RGT
          : null;
    let lftHlf = pxLft < rect.width / 2 ? DragDropClassCSS.LFT : DragDropClassCSS.RGT;
    let topHlf = pxTop < rect.height / 2 ? DragDropClassCSS.TOP : DragDropClassCSS.BOT;
    let middle = !topBot && !lftRgt ? DragDropClassCSS.MID : null;

    return { topBot, lftRgt, lftHlf, topHlf, middle };
  }

  static cleanupDragDropClasses(cleanDraggingClass = true): void {
    cleanDraggingClass && MiscUtil.removeClassFromAll(DragDropClassCSS.DRAGGING);

    MiscUtil.removeClassFromAll(DragDropClassCSS.OVER);

    MiscUtil.removeClassFromAll(DragDropClassCSS.TOP);
    MiscUtil.removeClassFromAll(DragDropClassCSS.BOT);
    MiscUtil.removeClassFromAll(DragDropClassCSS.LFT);
    MiscUtil.removeClassFromAll(DragDropClassCSS.RGT);

    MiscUtil.removeClassFromAll(DragDropClassCSS.MID);
  }

  static getDragStartType(el: HTMLElement): DragstartType {
    if (DragDrop.isFolderElement(el)) {
      return DragstartType.FOL;
    } else if (DragDrop.isFolderOrBkmElement(el)) {
      return DragstartType.BKM;
    } else if (DragDrop.getPinnedFolderElement(el)) {
      return DragstartType.PIN;
    } else {
      return DragstartType.POP;
    }
  }
  static getDropType(el: HTMLElement): DragoverOrDropType {
    let type = DragDrop.getDragStartType(el);
    if (type === DragstartType.BKM) {
      return DragoverOrDropType.BKM;
    } else if (type === DragstartType.FOL) {
      return DragoverOrDropType.FOL;
    } else {
      return DragoverOrDropType.PIN;
    }
  }
}
