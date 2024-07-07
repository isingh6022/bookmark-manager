import { BrowserBkmNode } from '@proj-types';
import { getNoun, getPageElId, getVerb } from './words.js';

class NodeGenerator {
  private static _currId = 1;
  private static _maxId = 50000;
  private static _folderGenProbability = 0.3;
  private static _longNamePropability = 0.4;
  private static _currTime = new Date().getTime();
  private static _dateRange = 365 * 24 * 3600 * 1000 * 2; // ms

  private static _getNewId(): string {
    if (this._currId > this._maxId) {
      throw 'Maximum limit for generated bookmark ids reached.';
    }
    return this._currId++ + '';
  }

  private static _getRandomDate(randomNo: number): number {
    let ms = Math.floor((randomNo - 0.5) * this._dateRange);
    return this._currTime + ms;
  }

  static getRandomNode(isFolder: boolean | null = null): BrowserBkmNode {
    let r = Math.random(),
      isFol = isFolder === null ? r > 1 - this._folderGenProbability : !!isFolder;

    let node: BrowserBkmNode = {
      title: (isFol ? getNoun(r) : getVerb(r)) + '',
      // (r > 1 - this._longNamePropability
      //   ? ' some long name some long name some long name some long name some long name '
      //   : ''),
      id: this._getNewId(),
      dateAdded: this._getRandomDate(r)
    };

    !isFol && (node.url = this._getUrl(node.title));

    return node;
  }
  private static _getUrl(title: string): string {
    let r = Math.random(),
      suffix = '';

    if (r > 0.5) {
      suffix = '#' + getPageElId(r);
    } else {
      let noun = getNoun(r);
      suffix = '?' + noun + '=' + noun + '_val';
    }

    return 'http://www.' + title + '.com' + suffix;
  }

  static createNode(createData: {
    title?: string;
    url?: string;
    parentId?: string;
    index?: number;
  }): BrowserBkmNode {
    let node = {
      id: this._getNewId(),
      title: createData.title ?? '',
      index: createData.index ?? 0,
      url: createData.url ?? '',
      parentId: createData.parentId
    };

    return node;
  }
}

export { NodeGenerator };
