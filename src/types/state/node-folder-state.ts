import { NodeCommonStateProperties } from './node-common-state.js';

enum FolderOnlyStateEvents {
  CTX_MENU_EXPAND_COLLAPSE
}
type FolderOnlyStateProperties = 'expanded' | 'childrenInit';
type FolderStateObject = {
  [key in NodeCommonStateProperties | FolderOnlyStateProperties]: boolean;
};

export { FolderOnlyStateEvents, FolderOnlyStateProperties, FolderStateObject };
