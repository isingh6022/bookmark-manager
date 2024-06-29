import { useDispatch } from 'react-redux';
import { MinorElementsRefCSS } from '@proj-const';
import {
  AppDispatchType,
  selectDeselectNode,
  deselectAll,
  chg,
  rmvIco,
  editPin
} from '@proj-state';
import { BookmarkComponentStateMachine, FolderComponentStateMachine, Util } from '@proj-scripts';
import {
  BookmarkTreeDataNode,
  NodeStateObject,
  FolderStateObject,
  Mode,
  NodeCommonStateEvents,
  NodeType
} from '@proj-types';

/**
 * Following is like a generator class. It contains methods for
 * handling events on a node. It does not retain any state.
 * It just takes inputs and quickly generates handlers. So,
 * it should be fast and lightweight.
 */
export class NodeModel {
  static isFolderState(
    state: NodeStateObject | FolderStateObject,
    node: BookmarkTreeDataNode
  ): state is FolderStateObject {
    return node.type === NodeType.FOL;
  }

  static createNewNodeStateMachine(isFolder: boolean) {
    return isFolder ? new FolderComponentStateMachine() : new BookmarkComponentStateMachine();
  }

  constructor(
    private _node: BookmarkTreeDataNode,
    private _mode: Mode,
    private _state: NodeStateObject | FolderStateObject,
    private _handleNodeStateEvent: (event: NodeCommonStateEvents) => void,
    private _updateMenuPosition: (position: { x: number; y: number }) => void,
    private _dispatch: ReturnType<typeof useDispatch<AppDispatchType>>
  ) {}

  getClassName() {
    return Util.misc.mergeClassNames(
      NodeModel.isFolderState(this._state, this._node)
        ? MinorElementsRefCSS.NOD_FOL
        : MinorElementsRefCSS.NOD_BKM,
      NodeModel.isFolderState(this._state, this._node)
        ? this._state.expanded
          ? MinorElementsRefCSS.FOL_EXPANDED
          : MinorElementsRefCSS.FOL_COLLAPSED
        : '',
      this._node.selected ? MinorElementsRefCSS.NOD_SEL : ''
    );
  }

  // Click handler
  /**
   * This method can be called without a click to toggle folder expansion.
   * It is used in this manner by folder's context menu.
   * In edit mode, it will select/deselect the node.
   * Selection only happens if actual click event is received.
   *
   * @param e React click event
   */
  onClick(e?: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (this._mode === Mode.EDIT && e && !e.ctrlKey) {
      e.preventDefault();
      this._dispatch(selectDeselectNode({ id: this._node.id, shiftKey: e.shiftKey }));
    } else {
      this._handleNodeStateEvent(NodeCommonStateEvents.CLICK);
      NodeModel.isFolderState(this._state, this._node) &&
        !this._state.expanded &&
        this._mode === Mode.EDIT &&
        this._dispatch(deselectAll(this._node.id));
    }
  }

  // Context menu handlers
  onContextMenu(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (Util.misc.isLocalUrl(this._node.url)) {
      return;
    }

    e.preventDefault();
    // e.stopPropagation();
    this._updateMenuPosition({ x: e.clientX, y: e.clientY });

    this._handleNodeStateEvent(NodeCommonStateEvents.RT_CLICK);
  }
  closeMenu() {
    this._handleNodeStateEvent(NodeCommonStateEvents.CTX_MENU_CLOSE);
  }
  rename() {
    if (this._node.isIcon) {
      this._dispatch(rmvIco(this._node.id));
    }
    this._handleNodeStateEvent(NodeCommonStateEvents.CTX_MENU_RENAME);
  }
  renameBlur(newTitle: string) {
    this._handleNodeStateEvent(NodeCommonStateEvents.RENAME_INPUT_BLUR);
    this._dispatch(chg({ changedNodeId: this._node.id, title: newTitle }));
    this._node.type === NodeType.FOL && this._dispatch(editPin({ id: this._node.id, newTitle }));
  }

  // // drag drop handlers
  // onDragstart(e: React.DragEvent<HTMLElement>) {
  //   console.log('onDragstart | nodeId = ', this._node.id);
  // }
  // onDragOver(e: React.DragEvent<HTMLElement>) {
  //   console.log('onDragOver | nodeId = ', this._node.id);
  // }
  // onDrop(e: React.DragEvent<HTMLElement>) {
  //   console.log('onDrop | nodeId = ', this._node.id);
  // }

  getHandlers() {
    return {
      onClick: this.onClick.bind(this),
      onContextMenu: this.onContextMenu.bind(this),
      closeMenu: this.closeMenu.bind(this),
      rename: this.rename.bind(this),
      renameBlur: this.renameBlur.bind(this)
      // onDragstart: this.onDragstart.bind(this),
      // onDragOver: this.onDragOver.bind(this),
      // onDrop: this.onDrop.bind(this)
    };
  }
}
