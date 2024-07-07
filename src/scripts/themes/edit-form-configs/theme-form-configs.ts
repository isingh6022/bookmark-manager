import {
  ColorFieldInfo,
  ThemeFormConfig,
  FieldGroupInfo,
  FieldGroupProps,
  FieldProps,
  NumberFieldInfo,
  ThemeColors,
  ThemeFormConfigInfo,
  BlankFieldInfo
} from '@proj-types';
import {
  ThemeFormConfImpl,
  getPropertyFromFormKey,
  setPropertyFromFormKey,
  getThemeConfConf,
  getGroupTitleFromKey
} from './theme-form-configs-configs.js';

type R = FieldProps<string, ColorFieldInfo | NumberFieldInfo | BlankFieldInfo> | FieldGroupProps;
type T = { [key in keyof ThemeColors]: R[] };

export function getThemeColorsFormConfigs(
  themeColors: ThemeColors,
  cb: Function,
  disabled: boolean
): T {
  let fGInfo: T = {
    topColors: [],
    leftColors: [],
    middleColors: [],
    rightColors: [],
    popupColors: []
  };
  let confConf = getThemeConfConf();

  fGInfo['topColors'] = createSectionConfig(themeColors, cb, disabled, confConf['topColors']);
  fGInfo['leftColors'] = createSectionConfig(themeColors, cb, disabled, confConf['leftColors']);
  fGInfo['middleColors'] = createSectionConfig(themeColors, cb, disabled, confConf['middleColors']);
  fGInfo['rightColors'] = createSectionConfig(themeColors, cb, disabled, confConf['rightColors']);
  fGInfo['popupColors'] = createSectionConfig(themeColors, cb, disabled, confConf['popupColors']);

  return fGInfo;
}

function createSectionConfig(
  themeColors: ThemeColors,
  afterChangeCB: Function,
  disabled: boolean,
  section:
    | ThemeFormConfigInfo['topColors']
    | ThemeFormConfigInfo['leftColors']
    | ThemeFormConfigInfo['middleColors']
    | ThemeFormConfigInfo['rightColors']
    | ThemeFormConfigInfo['popupColors']
): R[] {
  const propArr: R[] = [];

  for (let key in section) {
    let confConf = (<any>section)[key];

    if (confConf instanceof ThemeFormConfImpl) {
      propArr.push(createFieldProps(themeColors, afterChangeCB, confConf, disabled));
      confConf.followWithBlanks.forEach((blank, i) => {
        propArr.push({
          name: confConf.formKey + `-blank-${i}`,
          info: blank,
          onChange: () => {}
        });
      });
    } else {
      propArr.push(
        createFieldGroupProps(
          getGroupTitleFromKey(key),
          themeColors,
          afterChangeCB,
          confConf,
          disabled
        )
      );
    }
  }

  propArr.sort((p1, p2) => {
    let p1IsField = !(p1 as any).groupFieldsInfo,
      p2IsField = !(p2 as any).groupFieldsInfo;

    if (!p1IsField && !p2IsField) {
      return 0;
    } else if (!p1IsField) {
      return 1;
    } else if (!p2IsField) {
      return -1;
    } else {
      return (<FieldProps<any>>p1).info.order! - (<FieldProps<any>>p2).info.order!;
    }
  });

  return propArr;
}

function createFieldGroupProps(
  title: string,
  themeColors: ThemeColors,
  afterChangeCB: Function,
  group: { [key: string]: ThemeFormConfig },
  disabled: boolean
): FieldGroupProps {
  let groupFieldsInfo: FieldGroupInfo = {},
    fieldConf: ThemeFormConfig,
    dummyAfterChange = () => {};

  for (let key in group) {
    fieldConf = group[key]!;
    groupFieldsInfo[key] = createFieldProps(
      themeColors,
      dummyAfterChange,
      fieldConf,
      disabled
    ).info;
    fieldConf.followWithBlanks.forEach((blank, i) => {
      groupFieldsInfo[fieldConf.formKey + `-blank-${i}`] = blank;
    });
  }

  return {
    title,
    groupFieldsInfo,
    setInfo: (info) => {
      if (info) {
        for (let key in info) {
          let fieldConf = group[key],
            value = info[key];
          if (typeof value === 'number') {
            value = value + 'px';
          }
          if (fieldConf) {
            setPropertyFromFormKey(themeColors, fieldConf.formKey, value);
            fieldConf.dependentKeys.forEach((depKey) =>
              setPropertyFromFormKey(themeColors, depKey, value)
            );
          }
        }
        afterChangeCB();
      }
    },
    showBox: true
  };
}

function createFieldProps(
  themeColors: ThemeColors,
  afterChangeCB: Function,
  themeFieldConf: ThemeFormConfig,
  disabled: boolean
): FieldProps<string | number, ColorFieldInfo | NumberFieldInfo> {
  const value = getPropertyFromFormKey(themeColors, themeFieldConf.formKey)!;
  const setVal = (newVal: string) => {
    if (newVal === value) return;

    setPropertyFromFormKey(themeColors, themeFieldConf.formKey, newVal);
    themeFieldConf.dependentKeys.forEach((depKey) =>
      setPropertyFromFormKey(themeColors, depKey, newVal)
    );

    afterChangeCB();
  };
  const colorOnChange = (newVal: string) => setVal(newVal);
  const numberOnChange = (newVal: string | number) => setVal(newVal + 'px');
  const onChange: (newVal: string | number) => void = <(newVal: string | number) => void>(
    (themeFieldConf.type === 'number' ? numberOnChange : colorOnChange)
  );

  let info: ColorFieldInfo | NumberFieldInfo = <any>{
    value,
    label: themeFieldConf.formLabel,
    span: themeFieldConf.fieldSpan,
    inputSpan: themeFieldConf.inputSpan,
    justifyStart: themeFieldConf.justifyStart,
    hidden: themeFieldConf.hidden,
    order: themeFieldConf.order,
    disabled
  };
  if (themeFieldConf.type === 'color') {
    (<ColorFieldInfo>info).color = { hex: value };
  } else {
    (<NumberFieldInfo>info).number = { min: 0, max: 3 };
  }

  return {
    name: themeFieldConf.formKey,
    info,
    onChange
  };
}
