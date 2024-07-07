enum NodeCommonStateEvents {
  CLICK,

  RT_CLICK,
  /**
   *  To be fired by the context menu component just to close itself.
   * */
  CTX_MENU_CLOSE,
  CTX_MENU_RENAME,

  RENAME_INPUT_BLUR
}
type NodeCommonStateProperties =
  | 'editing'
  | 'ctxMenu'
  | 'dragging'
  | 'dragOver'
  | 'dragOverTop'
  | 'dragOverBottom'
  | 'dragOverLeft'
  | 'dragOverRight'
  | 'dragOverCenter';
type NodeStateObject = { [key in NodeCommonStateProperties]: boolean };

export { NodeCommonStateEvents, NodeCommonStateProperties, NodeStateObject };
