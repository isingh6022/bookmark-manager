import { useDispatch, useSelector } from 'react-redux';
import { ComponentRefCSS, GenericClassCSS, MinorElementsRefCSS, TIPS } from '@proj-const';
import { Util } from '@proj-scripts';
import { AppDispatchType, RootStateType, bkmNodeFlow, bkmDispOrder } from '@proj-state';
import { BKM_DISPLAY_ORDER, FLOW } from '@proj-types';
import { MdOutlineCategory, TbCategoryFilled, MdOutlineArrowCircleDown } from '../project-icons.js';

const stateSelectorDisplayOrderButton = (state: RootStateType): BKM_DISPLAY_ORDER =>
  state.settings.bkmDisplayOrder;
const DisplayOrderButton: React.FC<any> = () => {
  const currOrder = useSelector(stateSelectorDisplayOrderButton),
    nextOrder =
      currOrder === BKM_DISPLAY_ORDER.groupAndSort
        ? BKM_DISPLAY_ORDER.default
        : BKM_DISPLAY_ORDER.groupAndSort,
    dispatch = useDispatch<AppDispatchType>();

  return (
    <div onClick={() => dispatch(bkmDispOrder(nextOrder))} title={TIPS.DISP_ORDER}>
      {currOrder === BKM_DISPLAY_ORDER.groupAndSort ? <TbCategoryFilled /> : <MdOutlineCategory />}
    </div>
  );
};

const stateSelectorFlowDirectionButton = (state: RootStateType): FLOW =>
  state.settings.flowDirection;
const FlowDirectionButton: React.FC<any> = () => {
  const currDir = useSelector(stateSelectorFlowDirectionButton),
    newDir = currDir === FLOW.Col ? FLOW.Row : FLOW.Col,
    dispatch = useDispatch<AppDispatchType>();

  return (
    <div onClick={() => dispatch(bkmNodeFlow(newDir))} title={TIPS.FLOW_DIR}>
      <MdOutlineArrowCircleDown
        className={Util.misc.mergeClassNames(
          GenericClassCSS.ANIMATED,
          currDir === FLOW.Col ? '' : GenericClassCSS.ROT_90_ANTI_CLOC
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
