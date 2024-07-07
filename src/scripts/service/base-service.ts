import { BaseSingleton } from '../utilities/utilities.js';

export abstract class BaseService extends BaseSingleton {
  abstract readonly initialized: boolean;
  protected _onInitializeCallbacks: (() => void)[] = [];
  afterInit(fn: () => void): void {
    this.initialized ? fn() : this._onInitializeCallbacks.push(fn);
  }
  protected _initCallbacks(): void {
    this._onInitializeCallbacks.forEach((fn) => fn());
    this._onInitializeCallbacks = [];
  }
  abstract updateStateObject(state: any): void;
  abstract getInitState(): any;
}
