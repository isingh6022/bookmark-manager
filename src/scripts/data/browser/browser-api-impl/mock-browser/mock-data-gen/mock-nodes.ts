import { BrowserBkmNode } from '@proj-types';
import { generateTree } from './tree.js';
import { PersistantStorageRequests } from '../persistStorageRequests.js';

export async function GEN_MOCK_DATA(rootNodeChildCount: number[]): Promise<BrowserBkmNode[]> {
  return PersistantStorageRequests.getBookmarkData().then((savedData) => {
    let sameSizes = true;
    if (savedData.sizes.length === rootNodeChildCount.length) {
      for (let i = 0; i < rootNodeChildCount.length; i++) {
        if (rootNodeChildCount[i] !== savedData.sizes[i]) {
          sameSizes = false;
          break;
        }
      }
    } else {
      sameSizes = false;
    }

    if (sameSizes) {
      return savedData.data;
    } else {
      let data = rootNodeChildCount.map((n) => generateTree(n));
      PersistantStorageRequests.saveBookmarkData({ data, sizes: rootNodeChildCount });

      return data;
    }
  });
}
