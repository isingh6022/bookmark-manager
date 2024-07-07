import { NodeCommonStateProperties, NodeCommonStateEvents } from '@proj-types';

export abstract class StateMachine<Keys extends string, Event, Vals = boolean> {
  private _altered = false;
  constructor(private _currentState: { [k in Keys]: Vals }) {}

  updateProperty(key: Keys, val: Vals) {
    if (this._currentState[key] !== val) {
      this._altered = true;
      this._currentState[key] = val;
    }
  }

  getProperty(key: Keys): Vals {
    return this._currentState[key];
  }

  /**
   * Returns a reference to an object containing key value pairs for the state.
   * If state has been altered since the last time it was fetched, then a new
   * reference is returned, otherwise the reference remains same.
   */
  getState(): { [k in Keys]: Vals } {
    this._currentState = this._altered ? { ...this._currentState } : this._currentState;
    this._altered = false;
    return this._currentState;
  }

  abstract handle(event: Event): void;
}

export class NodeStateMachineHelper {
  public static readonly defaultNodeState: { [k in NodeCommonStateProperties]: boolean } = {
    editing: false,
    ctxMenu: false,
    dragging: false,
    dragOver: false,
    dragOverTop: false,
    dragOverBottom: false,
    dragOverLeft: false,
    dragOverRight: false,
    dragOverCenter: false
  };

  private static _removeDragProperties(
    state: StateMachine<NodeCommonStateProperties, NodeCommonStateEvents>
  ) {
    state.updateProperty('dragging', false);
    state.updateProperty('dragOver', false);
    state.updateProperty('dragOverTop', false);
    state.updateProperty('dragOverBottom', false);
    state.updateProperty('dragOverLeft', false);
    state.updateProperty('dragOverRight', false);
    state.updateProperty('dragOverCenter', false);
  }

  public static updateForMutualExclusivityTo(
    state: StateMachine<NodeCommonStateProperties, NodeCommonStateEvents>,
    exclusiveToProperty: NodeCommonStateProperties
  ) {
    switch (exclusiveToProperty) {
      case 'editing':
        this._removeDragProperties(state);
        state.updateProperty('ctxMenu', false);
        break;
      case 'ctxMenu':
        this._removeDragProperties(state);
        state.updateProperty('editing', false);
        break;
      case 'dragOver':
      case 'dragging':
        state.updateProperty('editing', false);
        state.updateProperty('ctxMenu', false);
        break;
    }
  }
}
