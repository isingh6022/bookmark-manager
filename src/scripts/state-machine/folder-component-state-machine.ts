import { NodeStateMachineHelper, StateMachine } from './base-state-machine.js';
// prettier-ignore
import {
  NodeCommonStateEvents, NodeCommonStateProperties,
  FolderOnlyStateEvents, FolderOnlyStateProperties
} from '@proj-types';

type FolderProperties = FolderOnlyStateProperties | NodeCommonStateProperties;
type FolderEvents = FolderOnlyStateEvents | NodeCommonStateEvents;

export class FolderComponentStateMachine extends StateMachine<FolderProperties, FolderEvents> {
  constructor() {
    super({
      expanded: false,
      childrenInit: false,
      ...NodeStateMachineHelper.defaultNodeState
    });
  }

  override handle(event: FolderEvents): void {
    switch (event) {
      case NodeCommonStateEvents.CLICK:
        NodeStateMachineHelper.updateForMutualExclusivityTo(this, 'editing');
        if (this.getProperty('editing')) {
          return;
        }

        this.updateProperty('expanded', !this.getProperty('expanded'));
        this.updateProperty('childrenInit', true);
        break;
      case NodeCommonStateEvents.RT_CLICK:
        if (this.getProperty('editing')) {
          NodeStateMachineHelper.updateForMutualExclusivityTo(this, 'editing');
          return;
        }
        this.updateProperty('ctxMenu', true);
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
      case FolderOnlyStateEvents.CTX_MENU_EXPAND_COLLAPSE:
        this.updateProperty('expanded', !this.getProperty('expanded'));
        this.updateProperty('childrenInit', true);
        NodeStateMachineHelper.updateForMutualExclusivityTo(this, 'ctxMenu');
        this.updateProperty('ctxMenu', false);
        break;
    }
  }
}
