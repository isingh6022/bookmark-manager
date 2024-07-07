import { RootStateType } from './store.js';

export class ReduxSelectorForArrOfElements<T extends any[]> {
  private _prevVals: T;
  private _selector: (state: RootStateType) => T;
  constructor(
    private _valuesGetter: (state: RootStateType) => T,
    private _id?: string // for debugging.
  ) {
    this._prevVals = [] as any;

    this._selector = (state: RootStateType) => {
      let currVals = this._valuesGetter(state);

      if (currVals.length !== this._prevVals.length) {
        return (this._prevVals = currVals);
      }

      for (let i = 0; i < currVals.length; i++) {
        if (currVals[i] !== this._prevVals[i]) {
          return (this._prevVals = currVals);
        }
      }

      return this._prevVals;
    };
  }

  get selector() {
    return this._selector;
  }
}
