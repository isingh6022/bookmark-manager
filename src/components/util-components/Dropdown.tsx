import { DROP_DOWN_EMPTY } from '@proj-const';
import { DropdownProps } from '@proj-types';

export const Dropdown: React.FC<DropdownProps> = (props) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let key = e.target.value;
    let option = props.options.find((option) => option.key === key);
    if (option) {
      props.onChange(option.key || DROP_DOWN_EMPTY.key);
    }
  };

  return (
    <select
      name={props.name}
      {...{ onChange, disabled: !!props.disabled, style: props.style }}
      defaultValue={props.selected || DROP_DOWN_EMPTY.key}
    >
      {props.addEmptyOption ? (
        <option value={DROP_DOWN_EMPTY.key}>{DROP_DOWN_EMPTY.text}</option>
      ) : (
        <></>
      )}

      {props.options.map((option) => (
        <option key={option.key} value={option.key}>
          {option.text}
        </option>
      ))}
    </select>
  );
};
