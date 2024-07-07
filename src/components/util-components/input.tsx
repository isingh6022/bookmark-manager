import React from 'react';
import {
  BlankFieldInfo,
  CheckboxFieldInfo,
  ColorFieldInfo,
  DropDownFieldInfo,
  DropdownProps,
  FieldProps,
  FieldSpan,
  NumberFieldInfo,
  RadioFieldInfo
} from '@proj-types';
import { MinorElementsRefCSS } from '@proj-const';
import { Util } from '@proj-scripts';
import { Dropdown } from './Dropdown.js';

const getWidthCSS = (inputSpan: FieldSpan): React.CSSProperties => {
  let flex = '0 0 auto',
    width: string;

  switch (inputSpan) {
    case FieldSpan.QUARTER:
      width = '25%';
      break;
    case FieldSpan.THREE_EIGHTH:
      width = '37.5%';
      break;
    case FieldSpan.HALF:
      width = '50%';
      break;
    case FieldSpan.THREE_QUARTERS:
      width = '75%';
      break;
    case FieldSpan.FULL:
      width = '100%';
      break;
    default:
      width = 'auto';
      break;
  }
  return { flex, width };
};

const NormalInput: React.FC<FieldProps<string>> = (props) => {
  const name = props.name,
    value = (props.info.value || '').toString(),
    style = getWidthCSS(props.info.inputSpan),
    disabled = !!props.info.disabled,
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value);

  return <input type="text" {...{ value, name, onChange, style, disabled }} />;
};

const DropDownInput: React.FC<FieldProps<string, DropDownFieldInfo>> = (props) => {
  const dropdownProps: DropdownProps = {
    name: props.name,
    style: getWidthCSS(props.info.inputSpan),
    selected: props.info.value + '',
    options: props.info.dropdown.options,
    disabled: !!props.info.disabled,
    onChange: props.onChange
  };

  return <Dropdown {...dropdownProps} />;
};

const NumberInput: React.FC<FieldProps<number, NumberFieldInfo>> = (props) => {
  const name = props.name,
    disabled = !!props.info.disabled,
    value =
      typeof props.info.value === 'number'
        ? props.info.value
        : parseInt(props.info.value + '') || 0,
    min = props.info.number.min,
    max = props.info.number.max,
    style = getWidthCSS(props.info.inputSpan),
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = parseFloat(e.target.value);

      if (isNaN(val)) {
        val = min || 0;
      } else if ((min || min === 0) && val <= min) {
        val = min;
      } else if ((max || max === 0) && val >= max) {
        val = max;
      }

      props.onChange(val);
    };

  return <input type="number" {...{ value, name, onChange, min, max, style, disabled }} />;
};

const RadioInputs: React.FC<FieldProps<string, RadioFieldInfo>> = (props) => {
  const name = props.name,
    disabled = !!props.info.disabled,
    type = 'radio',
    style = getWidthCSS(props.info.inputSpan),
    options = props.info.radio.options;

  return (
    <>
      {options.map((option) => {
        const key = option.value,
          readOnly = true,
          checked = option.value === props.info.value,
          label = option.optionLabel,
          onClick = () => props.onChange(option.value);

        return (
          <label
            {...{ onClick, style }}
            key={key}
            className={Util.misc.mergeClassNames(
              MinorElementsRefCSS.INPUT_RADIO_BTN_CONT,
              MinorElementsRefCSS.INPUT_CONT
            )}
          >
            <input {...{ type, checked, name, readOnly, disabled }} />
            <span>{label}</span>
          </label>
        );
      })}
    </>
  );
};

const ColorInput: React.FC<FieldProps<string, ColorFieldInfo>> = (props) => {
  const name = props.name,
    style = getWidthCSS(props.info.inputSpan),
    disabled = !!props.info.disabled,
    value = props.info.color.hex,
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value !== value && props.onChange(e.target.value);
    };

  return <input type="color" {...{ value, name, onChange, style, disabled }} />;
};

const CheckboxInput: React.FC<FieldProps<boolean, CheckboxFieldInfo>> = (props) => {
  const name = props.name,
    disabled = !!props.info.disabled,
    style = getWidthCSS(props.info.inputSpan),
    checked = (props.info.value || '') === 'false' || !props.info.value ? false : true,
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.checked !== checked && props.onChange(!checked);
    };

  return <input type="checkbox" {...{ checked, name, onChange, style, disabled }} />;
};
const BlankInput: React.FC<FieldProps<string, BlankFieldInfo>> = (props) => {
  return <div style={{ height: '1em' }}> </div>;
};

export const FieldWithLabel: React.FC<FieldProps<any>> = (props) => {
  let input: React.JSX.Element,
    isRadio = false;
  const info: any = props.info;

  if (props.info.hidden) return <></>;

  if (info.dropdown) {
    input = <DropDownInput {...(props as FieldProps<string, DropDownFieldInfo>)} />;
  } else if (info.number) {
    input = <NumberInput {...(props as FieldProps<number, NumberFieldInfo>)} />;
  } else if (info.radio) {
    input = <RadioInputs {...(props as FieldProps<string, RadioFieldInfo>)} />;
    isRadio = true;
  } else if (info.color) {
    input = <ColorInput {...(props as FieldProps<string, ColorFieldInfo>)} />;
  } else if (info.checkbox) {
    input = <CheckboxInput {...(props as FieldProps<boolean, CheckboxFieldInfo>)} />;
  } else if (info.blank) {
    input = <BlankInput {...(props as FieldProps<string, BlankFieldInfo>)} />;
  } else {
    input = <NormalInput {...props} />;
  }

  return (
    <>
      {isRadio ? (
        <div
          className={Util.misc.mergeClassNames(
            MinorElementsRefCSS.INPUT_CONT,
            isRadio ? MinorElementsRefCSS.INPUT_RADIO_CONT : ''
          )}
          style={getWidthCSS(props.info.span)}
        >
          {props.info.label ? (
            <span
              className={MinorElementsRefCSS.INPUT_RADIO_TITLE}
              style={getWidthCSS((props.info as RadioFieldInfo).radio.titleSpan)}
            >
              {props.info.label}
            </span>
          ) : (
            <></>
          )}
          {input}
        </div>
      ) : (
        <label
          className={Util.misc.mergeClassNames(
            MinorElementsRefCSS.INPUT_CONT,
            isRadio ? MinorElementsRefCSS.INPUT_RADIO_CONT : '',
            props.info.justifyStart ? MinorElementsRefCSS.INPUT_CONT_JUSTIFY_START : ''
          )}
          style={getWidthCSS(props.info.span)}
        >
          <span style={props.info.labelSpan ? getWidthCSS(props.info.labelSpan) : {}}>
            {props.info.label}
          </span>
          {input}
        </label>
      )}
    </>
  );
};
