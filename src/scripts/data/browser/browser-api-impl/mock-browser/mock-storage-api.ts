import { PersistantStorageRequests } from './persistStorageRequests.js';

type StrKeyObj<T> = { [key: string]: T };
type ChangeHandler = (changes: { [key: string]: StorageChange }, areaName: any) => void;

interface StorageChange {
  newValue?: any;
  oldValue?: any;
}
interface SubStorage {
  clear(): Promise<void>;
  set(items: StrKeyObj<any>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  get(keys?: string | string[] | StrKeyObj<any> | null): Promise<StrKeyObj<any>>;

  onChangeListener: ChangeHandler;
  onChanged: {
    addListener: (callback: ChangeHandler) => void;
  };
}

class MockStorage {
  private static _localStore: StrKeyObj<any> = {};
  static readonly local: SubStorage = {
    clear() {
      return MockStorage._execWithVoidPromise(() => {
        let oldStore = MockStorage._localStore;
        MockStorage._localStore = {};

        MockStorage._clear();
        MockStorage._triggerOnchange(Object.keys(oldStore), oldStore);
      });
    },
    set(items: StrKeyObj<any>): Promise<void> {
      return MockStorage._execWithVoidPromise(() => {
        let keys = Object.keys(items),
          oldVals: StrKeyObj<any> = {};

        for (let key of keys) {
          oldVals[key] = MockStorage._localStore[key];
        }

        MockStorage._localStore = { ...MockStorage._localStore, ...(items || {}) };
        MockStorage._persist();
        MockStorage._triggerOnchange(keys, oldVals);
      });
    },
    remove: function (keys: string | string[]): Promise<void> {
      return MockStorage._execWithVoidPromise(() => {
        let oldVals: StrKeyObj<any> = {};
        if (keys instanceof Array) {
          for (let key of keys) {
            oldVals[key] = MockStorage._localStore[key];
            delete MockStorage._localStore[key];
          }
        } else {
          oldVals = MockStorage._localStore[keys];
          delete MockStorage._localStore[keys];
          keys = [keys];
        }

        MockStorage._persist();
        MockStorage._triggerOnchange(keys, oldVals);
      });
    },
    get: function (keys?: string | string[] | null | undefined): Promise<StrKeyObj<any>> {
      return new Promise((resolve, reject) => {
        MockStorage._load()
          .then((data) => {
            MockStorage._localStore = data;
            let obj: StrKeyObj<any> = {};

            if (!keys) {
              obj = { ...MockStorage._localStore };
            } else if (keys instanceof Array) {
              for (let key of keys) {
                obj[key] = MockStorage._localStore[key];
              }
            } else {
              obj[keys] = MockStorage._localStore[keys];
            }

            resolve(obj);
          })
          .catch((err) => console.error(err));
      });
    },

    onChangeListener: (changes: { [key: string]: StorageChange }) => {},
    onChanged: {
      addListener(fn: ChangeHandler) {
        MockStorage.local.onChangeListener = fn;
      }
    }
  };
  private static _execWithVoidPromise(fn: Function) {
    return new Promise<void>((res, rej) => {
      fn();
      res();
    });
  }

  private static _triggerOnchange(keys: string[], oldValues: StrKeyObj<any>) {
    MockStorage.local.onChangeListener(MockStorage._getChangesObj(keys, oldValues), 'local');
  }
  private static _getChangesObj(
    keys: string[],
    oldValues: StrKeyObj<any>
  ): StrKeyObj<StorageChange> {
    let changes: StrKeyObj<StorageChange> = {};
    const getStorageChange = (newValue: any, oldValue: any) => ({ newValue, oldValue });

    for (let key of keys) {
      changes[key] = getStorageChange(MockStorage._localStore[key], oldValues[key]);
    }
    return changes;
  }
  private static _persist() {
    PersistantStorageRequests.saveData(MockStorage._localStore);
  }
  private static _load(): Promise<{ [key: string]: any }> {
    return PersistantStorageRequests.getData();
  }
  private static _clear() {
    return PersistantStorageRequests.clearData();
  }
}

export { MockStorage };
