import { DragDropClassCSS, MIN_NODES_PER_ROW, MinorElementsRefCSS } from '@proj-const';
import { BookmarkTreeDataNode, DropZone, FLOW, NodeType } from '@proj-types';
import { MiscUtil } from './misc-util.js';

export class NodeIndices {
  static sortNodesForGrouping<T extends { url?: string; readonly title_lower: string }>(
    nodes: T[]
  ): T[] {
    let sortedNodes = [...nodes];
    const _getUrlAfterProtocol = (url: string): string => {
      let match = url.match(/:\/\/\/?/);
      if (!match || !match.index) return url;

      return url.substring(match.index + match[0].length, url.length).toLowerCase();
    };

    sortedNodes.sort((a, b) => {
      if (!a.url) {
        if (b.url) {
          return -1;
        }
        return a.title_lower > b.title_lower ? 1 : -1;
      } else {
        if (!b.url) return 1;
      }

      return _getUrlAfterProtocol(a.url) > _getUrlAfterProtocol(b.url) ? 1 : -1;
    });

    return sortedNodes;
  }

  static getChildBkmNodesByDate(node: BookmarkTreeDataNode): BookmarkTreeDataNode[] {
    let children = this._getChildBkmList(node);
    children.sort((a, b) => b.dateAdded - a.dateAdded);

    return children;
  }
  private static _getChildBkmList(node: BookmarkTreeDataNode): BookmarkTreeDataNode[] {
    let children: BookmarkTreeDataNode[] = [];

    for (let child of node.children) {
      child.type === NodeType.BKM
        ? children.push(child)
        : children.push(...NodeIndices._getChildBkmList(child));
    }

    return children;
  }

  static groupAndSortNodes<T extends { title: string; type: NodeType; url?: string }>(
    nodes: T[]
  ): T[] {
    return [...nodes].sort((a, b) => {
      if (a.type !== b.type) return a.type === NodeType.BKM ? 1 : -1;

      const titleA = (a.title || '').toLowerCase(),
        titleB = (b.title || '').toLowerCase();
      const titleComparison = titleA > titleB ? 1 : titleA === titleB ? 0 : -1;
      if (titleComparison || a.type === NodeType.FOL) return titleComparison;

      const urlA = (a.url || '').toLowerCase(),
        urlB = (b.url || '').toLowerCase();
      return urlA > urlB ? 1 : urlA === urlB ? 0 : -1;
    });
  }

  static getNodeChildrenColClass(
    flow: FLOW,
    index: number,
    colCount: number,
    isRootCol: boolean,
    hasOddSubFolChildren: boolean
  ): string {
    return MiscUtil.mergeClassNames(
      MinorElementsRefCSS.NOD_CH_COL,
      flow === FLOW.Row ? MinorElementsRefCSS.NOD_CH_COL_ROW_FLOW : '',
      isRootCol ? MinorElementsRefCSS.NOD_CH_ROOT : '',
      isRootCol
        ? ''
        : hasOddSubFolChildren
          ? MinorElementsRefCSS.NOD_CH_ODD
          : MinorElementsRefCSS.NOD_CH_EVN
      // `${MinorElementsRefCSS.NOD_CH_COL}-${index + 1}-by-${colCount}`
    );
  }
  static getNodeChildrenColKey(index: number, colCount: number): string {
    return `${MinorElementsRefCSS.NOD_CH_COL}-${index}-${colCount}`;
  }

  static getElementIndexInParent(el: HTMLElement): number {
    if (!el.parentElement) return -1;

    let index: number,
      children = el.parentElement.children;

    for (index = 0; index < children.length; index++) {
      if (children[index] === el) break;
    }
    index = index < children.length ? index : -1;

    return index;
  }
  static getPrevSibling(el: HTMLElement): HTMLElement | null {
    if (!el.parentElement) return null;

    let index = this.getElementIndexInParent(el);
    return (index > 0 && <HTMLElement>el.parentElement?.children[index - 1]) || null;
  }
  static getNextSibling(el: HTMLElement): HTMLElement | null {
    if (!el.parentElement) return null;

    let index = this.getElementIndexInParent(el);
    return (
      (index < el.parentElement.children.length - 1 &&
        <HTMLElement>el.parentElement?.children[index + 1]) ||
      null
    );
  }

  static addTopBotClassToAdjacentEl(el: HTMLElement, topHlf: DropZone['topHlf']) {
    if (topHlf === DragDropClassCSS.TOP) {
      const prev = this.getPrevSibling(el);
      prev && prev.classList.add(DragDropClassCSS.BOT);
    } else {
      const next = this.getNextSibling(el);
      next && next.classList.add(DragDropClassCSS.TOP);
    }
  }
  static addLftRgtClassToAdjacentNodeEl(el: HTMLElement, lftHlf: DropZone['lftHlf']) {
    if (!el.parentElement?.classList.contains(MinorElementsRefCSS.NOD_CH_ROOT)) return;

    const colIndex = this.getElementIndexInParent(el.parentElement),
      elIndex = this.getElementIndexInParent(el);

    if (lftHlf === DragDropClassCSS.LFT) {
      if (colIndex > 0) {
        const prevCol = el.parentElement.parentElement!.children[colIndex - 1];
        if (prevCol && elIndex < prevCol.children.length) {
          const leftEl = prevCol.children[elIndex];
          leftEl && leftEl.classList.add(DragDropClassCSS.RGT);
        }
      }
    } else {
      if (
        el.parentElement.parentElement &&
        colIndex < el.parentElement.parentElement.children.length - 1
      ) {
        const nextCol = el.parentElement.parentElement.children[colIndex + 1];
        if (nextCol && elIndex < nextCol.children.length) {
          const nextEl = nextCol.children[elIndex];
          nextEl && nextEl.classList.add(DragDropClassCSS.LFT);
        }
      }
    }
  }

  static getNodeListForCol(dir: FLOW, nodes: any[], index: number, colCount: number): any[] {
    switch (dir) {
      case FLOW.Row:
        return NodeIndices._getNodeListRowDir(nodes, index, colCount);
      case FLOW.Col:
        return NodeIndices._getNodeListColDir(nodes, index, colCount);
      default:
        return NodeIndices._getNodeListRowDir(nodes, index, colCount);
    }
  }
  private static _getNodeListRowDir(nodes: any[], colIndex: number, colCount: number): any[] {
    let output: any[] = [];
    for (let i = colIndex; i < nodes.length; i += colCount) output.push(nodes[i]);
    return output;
  }

  private static _getNodeListColDir(nodes: any[], colIndex: number, colCount: number): any[] {
    let n: number = Math.ceil(nodes.length / colCount),
      i1: number,
      i2: number;

    n = n < MIN_NODES_PER_ROW ? MIN_NODES_PER_ROW : n;
    i1 = n * colIndex;
    i2 = i1 + n > nodes.length ? nodes.length : i1 + n;

    return nodes.slice(i1, i2);
  }
}
