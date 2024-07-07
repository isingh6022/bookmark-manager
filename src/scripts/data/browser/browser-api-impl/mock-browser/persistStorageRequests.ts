import { BrowserBkmNode } from '@proj-types';

export class PersistantStorageRequests {
  /**
   * @returns JSON string containing persisted data.
   */
  static getData(): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:8081/fetch', { method: 'POST' })
        .then((res) => resolve(res.json()))
        .catch((err) => (console.error(err), reject(err)));
    });
  }

  static getBookmarkData(): Promise<{ data: BrowserBkmNode[]; sizes: number[] }> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:8081/load_bookmarks', { method: 'POST' })
        .then((res) => res.json())
        .then((loadedData: { data: BrowserBkmNode[]; sizes: number[] }) => {
          if (loadedData?.data?.length && loadedData?.sizes?.length) {
            setTimeout(() => resolve(loadedData), 400);
          } else {
            resolve({ data: [], sizes: [0] });
          }
        })
        .catch((err) => (console.error(err), resolve({ data: [], sizes: [0] })));
    });
  }

  static saveBookmarkData(bkmData: { data: BrowserBkmNode[]; sizes: number[] }): void {
    let dataJSON: string = '{"data":[],"sizes":[0]}';
    try {
      dataJSON = JSON.stringify(bkmData);
    } catch (err) {
      console.error('Failed to stringify bookmark data: ', bkmData);
    }

    fetch('http://localhost:8081/save_bookmarks', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: dataJSON
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  static clearData(): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:8081/clear', { method: 'POST' })
        .then((res) => resolve())
        .catch((err) => (console.error(err), reject(err)));
    });
  }

  static saveData(newData: any) {
    if (typeof newData === 'object' && !Array.isArray(newData)) {
      try {
        newData = JSON.stringify(newData);
      } catch (err) {
        console.error('Failed to stringify data object: ', newData);
      }

      fetch('http://localhost:8081/save', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: newData
      })
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    }
  }
}
