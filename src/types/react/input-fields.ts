import React from 'react';

enum FieldSpan {
  FULL,
  QUARTER,
  THREE_EIGHTH,
  HALF,
  THREE_QUARTERS
}
interface DropdownOption {
  key: string;
  text: string;
}
// This the input - not the whole field.
interface DropdownProps {
  name: string;
  style?: React.CSSProperties;
  selected?: string;
  options: DropdownOption[];
  addEmptyOption?: boolean;
  disabled?: boolean;
  onChange: (selectedKey: string) => void;
}

interface FieldInfo {
  value: string | number | boolean;
  label: string;
  span: FieldSpan;
  inputSpan: FieldSpan;
  labelSpan?: FieldSpan;
  justifyStart?: boolean;
  order?: number;
  hidden?: boolean;
  disabled?: boolean;
}
interface DropDownFieldInfo extends FieldInfo {
  dropdown: {
    options: DropdownOption[];
  };
}
interface NumberFieldInfo extends FieldInfo {
  number: {
    min?: number;
    max?: number;
  };
}
interface RadioFieldInfo extends FieldInfo {
  // span applied to each of the fields.
  // name fetched the same way as key - key in FieldGroupInfo.
  radio: {
    titleSpan: FieldSpan;
    options: {
      optionLabel: string;
      value: string;
    }[];
  };
}
interface ColorFieldInfo extends FieldInfo {
  color: {
    hex: string;
  };
}
interface BlankFieldInfo extends FieldInfo {
  blank: {};
}
interface CheckboxFieldInfo extends FieldInfo {
  checkbox: {};
}
interface FieldGroupInfo {
  [id: string]:
    | FieldInfo
    | DropDownFieldInfo
    | NumberFieldInfo
    | RadioFieldInfo
    | ColorFieldInfo
    | BlankFieldInfo
    | CheckboxFieldInfo;
}

interface FieldGroupProps {
  title?: string;
  groupFieldsInfo: FieldGroupInfo;
  setInfo: (currInfo: any) => void;

  showBox?: boolean;
}
interface FieldProps<changeVal extends string | number | boolean, T extends FieldInfo = FieldInfo> {
  /**
   * Not to be used for html id.
   */
  name: string;
  info: T;
  onChange: (newVal: changeVal) => void;
}

// prettier-ignore
export type {
  FieldInfo, DropDownFieldInfo, NumberFieldInfo, RadioFieldInfo,
  ColorFieldInfo, BlankFieldInfo, CheckboxFieldInfo,
  FieldGroupInfo, FieldGroupProps,
  FieldProps, DropdownProps
};
export { FieldSpan };
