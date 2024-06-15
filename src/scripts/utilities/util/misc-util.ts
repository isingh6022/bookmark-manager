import { NODE_HEIGHT_REM } from '@proj-const';
import { BookmarkTreeDataNode } from '@proj-types';
import { BROWSER } from '../../data/browser/browser-api.js';

export class MiscUtil {
  static getBrowserIconUrl(url: string): string {
    return BROWSER.actions.getBkmIconSrc(url);
  }
  static cloneSerializable<T>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((el) => this.cloneSerializable(el)) as any;

    let clone = {} as any;
    for (let key in obj) {
      clone[key] = this.cloneSerializable(obj[key]);
    }
    return clone;
  }
  static deleteElementsByArrayIndices<T>(arr: T[], indices: number[]): T[] {
    if (!indices.length) return arr;

    let delCount = 1,
      nextDelIndex = indices[delCount];
    indices.sort((a, b) => a - b);

    for (let i = indices[delCount - 1] || Infinity; i < arr.length; i++) {
      let j = i + delCount;
      while (j === nextDelIndex) {
        delCount++, j++, (nextDelIndex = indices[delCount]);
      }

      arr[i] = <any>arr[j];
    }
    arr.splice(arr.length - delCount, delCount);

    return arr;
  }
  static moveArrElementFromTo(arr: any[], currIndex: number, newIndex: number) {
    if (currIndex < 0 || newIndex < 0 || currIndex >= arr.length || newIndex > arr.length) {
      return;
    }
    currIndex < newIndex && newIndex--;
    let el = arr.splice(currIndex, 1)[0];
    arr.splice(newIndex, 0, el);
  }

  static isLocalUrl(url: string): boolean {
    return !!url.match(/^file:\/\//);
  }

  static getBkmFolNodeElId(nodeId: string): string {
    return 'node-' + nodeId;
  }
  static getBkmFolNodeIdFromEl(el: HTMLElement): string {
    return el.id.replace(/^node-/, '');
  }
  static getPinFolElId(nodeId: string): string {
    return 'pin-fol-' + nodeId;
  }
  static getPinFolIdFromEl(el: HTMLElement): string {
    return el.id.replace(/^pin-fol-/, '');
  }

  /**
   * Children in a subfolder are deselected when subfolder is collapsed.
   */
  static getSelectedVisibleNodes(node: BookmarkTreeDataNode): BookmarkTreeDataNode[] {
    let selectedNodes: BookmarkTreeDataNode[] = [],
      stack: BookmarkTreeDataNode[] = [node],
      currNode: BookmarkTreeDataNode;

    while (stack.length) {
      currNode = stack.pop()!;
      currNode.selected && selectedNodes.push(currNode);
      stack.push(...currNode.children);
    }

    return selectedNodes;
  }

  static mergeClassNames(...classNames: string[]): string {
    return classNames.filter((cl) => cl).join(' ');
  }

  static dummyPinData(n = 100): { id: string; title: string; removable: boolean }[] {
    const name = (n: number) => {
      let words = Math.round(Math.random() * 10);
      let str = 'Pin ' + n + ' ';
      while (words--) str += ' Pin';
      return str;
    };
    let pinStr = '',
      i = 1;
    while (i < n) (pinStr += `p${i}:${name(i)},`), i++;

    const pins = pinStr.split(',').map((pinData) => {
      let data = pinData.split(':');
      return { id: data[0] || 'asdf', title: data[1] || 'asdf', removable: true };
    });

    pins[0]!.removable = false;
    pins[1]!.removable = false;
    pins[2]!.removable = false;
    pins[3]!.removable = false;

    return pins;
  }

  static getSubFolContainerHt(element: HTMLElement | null, childCount = 0): string {
    if (!element || element.children.length === 0) {
      return childCount * NODE_HEIGHT_REM + 'rem';
    } else {
      let heightPx = 0;
      for (let i = 0; i < element.children.length; i++) {
        heightPx += element.children[i]?.clientHeight || 0;
      }
      return heightPx + 'px';
    }
  }

  private static _prevFontSize: string = '';
  private static _prevRemSize: number = 0;
  static getRemSize(): number {
    let fs = getComputedStyle(document.documentElement).fontSize;

    if (fs && this._prevRemSize && fs === this._prevFontSize) {
      return this._prevRemSize;
    }
    let size = fs.match(/\d+/g) || ['0'];

    return (this._prevRemSize = parseInt(size[0]) || 14);
  }
  static remToPx(rem: number): number {
    return rem * this.getRemSize();
  }

  static getUniqueId(): string {
    return Math.random() + '' + new Date().getTime();
  }

  static removeClassFromAll(className: string): void {
    let elList = document.getElementsByClassName(className);
    Array.from(elList).forEach((el) => el.classList.remove(className));
  }

  static removeClassFromAllWithException(className: string, exceptEl: HTMLElement): void {
    let elList = document.getElementsByClassName(className);
    Array.from(elList).forEach((el) => el !== exceptEl && el.classList.remove(className));
  }
}
