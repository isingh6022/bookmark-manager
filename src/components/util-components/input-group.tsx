import { MinorElementsRefCSS } from '@proj-const';
import { Util } from '@proj-scripts';
import { FieldGroupProps, FieldProps } from '@proj-types';
import { FieldWithLabel } from './input.js';

export const InputGroup: React.FC<FieldGroupProps> = (props) => {
  const fieldsInfo = props.groupFieldsInfo,
    fieldProps: FieldProps<any>[] = [],
    currVals: Parameters<FieldGroupProps['setInfo']>[0] = {};

  for (let name in fieldsInfo) {
    let info = fieldsInfo[name]!;
    currVals[name] = info.value;

    fieldProps.push({
      name,
      onChange: (newVal: string | boolean | number) => {
        if (newVal !== currVals[name]) {
          currVals[name] = newVal;
          props.setInfo(currVals);
        }
      },
      info
    });
  }

  fieldProps.sort((f1, f2) => {
    let n1 = typeof f1.info.order === 'number' ? f1.info.order : null,
      n2 = typeof f2.info.order === 'number' ? f2.info.order : null;

    if (n1 === null && n2 === null) {
      return 0;
    } else if (n1 === null) {
      return -1;
    } else if (n2 === null) {
      return 1;
    } else {
      return n1 - n2;
    }
  });

  return (
    <div
      className={Util.misc.mergeClassNames(
        MinorElementsRefCSS.FIELD_GROUP_CONT,
        props.showBox ? MinorElementsRefCSS.FIELD_GROUP_BOXED : ''
      )}
    >
      <div className={props.title ? MinorElementsRefCSS.FIELD_GROUP_TITLE : ''}>
        {props.title || ''}
      </div>
      <div className={MinorElementsRefCSS.FIELD_GROUP_FIELDS}>
        {fieldProps.map((fieldProp) => {
          return <FieldWithLabel {...fieldProp} key={fieldProp.name} />;
        })}
      </div>
    </div>
  );
};
