import { useDispatch, useSelector } from 'react-redux';
import { ComponentRefCSS, GenericClassCSS, MinorElementsRefCSS, TIPS } from '@proj-const';
import { Util } from '@proj-scripts';
import { AppDispatchType, RootStateType, bkmNodeFlow, bkmDispOrder } from '@proj-state';
import { BkmDisplayOrder, Flow } from '@proj-types';
import { MdOutlineCategory, TbCategoryFilled, MdOutlineArrowCircleDown } from '../project-icons.js';

const stateSelectorDisplayOrderButton = (state: RootStateType): BkmDisplayOrder =>
  state.settings.bkmDisplayOrder;
const DisplayOrderButton: React.FC<any> = () => {
  const currOrder = useSelector(stateSelectorDisplayOrderButton),
    nextOrder =
      currOrder === BkmDisplayOrder.GROUP_AND_SORT
        ? BkmDisplayOrder.DEFAULT
        : BkmDisplayOrder.GROUP_AND_SORT,
    dispatch = useDispatch<AppDispatchType>();

  return (
    <div onClick={() => dispatch(bkmDispOrder(nextOrder))} title={TIPS.DISP_ORDER}>
      {currOrder === BkmDisplayOrder.GROUP_AND_SORT ? <TbCategoryFilled /> : <MdOutlineCategory />}
    </div>
  );
};

const stateSelectorFlowDirectionButton = (state: RootStateType): Flow =>
  state.settings.flowDirection;
const FlowDirectionButton: React.FC<any> = () => {
  const currDir = useSelector(stateSelectorFlowDirectionButton),
    newDir = currDir === Flow.COL ? Flow.ROW : Flow.COL,
    dispatch = useDispatch<AppDispatchType>();

  return (
    <div onClick={() => dispatch(bkmNodeFlow(newDir))} title={TIPS.FLOW_DIR}>
      <MdOutlineArrowCircleDown
        className={Util.misc.mergeClassNames(
          GenericClassCSS.ANIMATED,
          currDir === Flow.COL ? '' : GenericClassCSS.ROT_90_ANTI_CLOC
        )}
      />
    </div>
  );
};

export const StateButtons: React.FC<any> = () => (
  <div
    id={ComponentRefCSS.STAT_BTN_ID}
    className={Util.misc.mergeClassNames(
      GenericClassCSS.FLEX_ROW_CENTER_NOWRAP,
      MinorElementsRefCSS.ADDR_BAR_ICON_CONT
    )}
  >
    <DisplayOrderButton /> <FlowDirectionButton />
  </div>
);
