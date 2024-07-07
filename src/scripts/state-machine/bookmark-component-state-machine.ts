import { StateMachine, NodeStateMachineHelper } from './base-state-machine.js';
import { NodeCommonStateEvents, NodeCommonStateProperties } from '@proj-types';

export class BookmarkComponentStateMachine extends StateMachine<
  NodeCommonStateProperties,
  NodeCommonStateEvents
> {
  constructor() {
    super({
      ...NodeStateMachineHelper.defaultNodeState
    });
  }

  override handle(event: NodeCommonStateEvents): void {
    switch (event) {
      case NodeCommonStateEvents.CLICK:
        NodeStateMachineHelper.updateForMutualExclusivityTo(this, 'editing');
        break;
      case NodeCommonStateEvents.RT_CLICK:
        if (this.getProperty('editing')) {
          NodeStateMachineHelper.updateForMutualExclusivityTo(this, 'editing');
          return;
        }
        this.updateProperty('ctxMenu', !this.getProperty('ctxMenu'));
        NodeStateMachineHelper.updateForMutualExclusivityTo(this, 'ctxMenu');
        break;
      case NodeCommonStateEvents.CTX_MENU_CLOSE:
        this.updateProperty('ctxMenu', false);
        break;
      case NodeCommonStateEvents.CTX_MENU_RENAME:
        this.updateProperty('editing', true);
        NodeStateMachineHelper.updateForMutualExclusivityTo(this, 'editing');
        break;
      case NodeCommonStateEvents.RENAME_INPUT_BLUR:
        this.updateProperty('editing', false);
        NodeStateMachineHelper.updateForMutualExclusivityTo(this, 'editing');
        break;
    }
  }
}
