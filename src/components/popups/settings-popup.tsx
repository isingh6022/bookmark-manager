import { useDispatch, useSelector } from 'react-redux';
import {
  SettingsPopup,
  BKM_DISPLAY_ORDER,
  FLOW,
  Pin,
  FieldGroupInfo,
  RadioFieldInfo,
  FieldSpan,
  FieldGroupProps
} from '@proj-types';
import {
  AppDispatchType,
  RootStateType,
  ReduxSelectorForArrOfElements,
  homePin,
  bkmDispOrder,
  bkmNodeFlow,
  colCount
} from '@proj-state';
import { useState } from 'react';
import { InputGroup } from '../util-components/input-group.js';

type SettTypes = [FLOW, BKM_DISPLAY_ORDER, number, string | undefined, Pin[]];
const settingsPopupSelector = new ReduxSelectorForArrOfElements<SettTypes>(
  (state: RootStateType) => [
    state.settings.flowDirection,
    state.settings.bkmDisplayOrder,
    state.settings.bkmFolderColCount,
    state.settings.homeFolder,
    state.settings.pinnedFolders
  ]
).selector;

export const SettingsPopupComponent: React.FC<SettingsPopup> = (popup) => {
  const [flowDirection, bkmDisplayOrder, bkmFolderColCount, homeFolder, pins] =
    useSelector(settingsPopupSelector);

  const dispatch = useDispatch<AppDispatchType>();

  const onFlowDirSelect = (flow: FLOW) => dispatch(bkmNodeFlow(flow));
  const onDisplayOrderChange = (order: BKM_DISPLAY_ORDER) => dispatch(bkmDispOrder(order));
  const onColCountChange = (count: number) => dispatch(colCount(count));
  const onHomePinSelect = (pinKey: string) => dispatch(homePin(pinKey));

  const dispDirInpGrInfo: FieldGroupInfo = {
    flow: {
      value: flowDirection,
      label: '',
      span: FieldSpan.FULL,
      inputSpan: FieldSpan.THREE_EIGHTH,
      radio: {
        titleSpan: FieldSpan.FULL,
        options: [
          {
            optionLabel: 'Row',
            value: FLOW.Row
          },
          {
            optionLabel: 'Column',
            value: FLOW.Col
          }
        ]
      }
    } as RadioFieldInfo
  };
  const groupingInpGrInfo: FieldGroupInfo = {
    bkmDisplayOrder: {
      value: bkmDisplayOrder,
      label: '',
      span: FieldSpan.FULL,
      inputSpan: FieldSpan.THREE_EIGHTH,
      radio: {
        titleSpan: FieldSpan.FULL,
        options: [
          {
            optionLabel: 'Do Group',
            value: BKM_DISPLAY_ORDER.groupAndSort as any
          },
          {
            optionLabel: 'Default order',
            value: BKM_DISPLAY_ORDER.default
          }
        ]
      }
    } as RadioFieldInfo
  };
  const numAndHomeInpGrInfo: FieldGroupInfo = {
    bkmFolderColCount: {
      label: 'Columns / divisions for bookmarks',
      value: bkmFolderColCount,
      span: FieldSpan.FULL,
      inputSpan: FieldSpan.THREE_EIGHTH,
      number: {
        min: 1,
        max: 7
      }
    },
    homePinDropdown: {
      label: 'Select Home Folder',
      value: homeFolder as any,
      span: FieldSpan.FULL,
      inputSpan: FieldSpan.THREE_EIGHTH,
      dropdown: {
        options: pins.map((pin) => ({ key: pin.id, text: pin.title }))
      }
    }
  };

  const dispDirInpGr: FieldGroupProps = {
    title: 'Whether to fill the rows or columns first',
    groupFieldsInfo: dispDirInpGrInfo,
    setInfo: (info: { flow: FLOW }) => {
      if (flowDirection !== info.flow) {
        onFlowDirSelect(info.flow!);
      }
    },
    showBox: true
  };
  const groupingInpGr: FieldGroupProps = {
    title: 'Group folders and sort all',
    groupFieldsInfo: groupingInpGrInfo,
    setInfo: (info: { bkmDisplayOrder: BKM_DISPLAY_ORDER }) => {
      if (info.bkmDisplayOrder !== bkmDisplayOrder) {
        onDisplayOrderChange(info.bkmDisplayOrder);
      }
    },
    showBox: true
  };
  const numAndHomeInpGr: FieldGroupProps = {
    title: '',
    groupFieldsInfo: numAndHomeInpGrInfo,
    setInfo: (info: { bkmFolderColCount: number; homePinDropdown: string }) => {
      if (info.bkmFolderColCount !== bkmFolderColCount) {
        onColCountChange(info.bkmFolderColCount);
      } else if (info.homePinDropdown !== homeFolder) {
        onHomePinSelect(info.homePinDropdown);
      }
    },
    showBox: false
  };

  return (
    <div>
      <InputGroup {...dispDirInpGr} />
      <InputGroup {...groupingInpGr} />
      <InputGroup {...numAndHomeInpGr} />
    </div>
  );
};
