import { FieldSpan, BlankFieldInfo } from '../react/input-fields.js';

interface ThemeFormConfig {
  /**
   * One should be able to access the color property by applying the key to ThemeColors
   */
  formKey: string;
  formLabel: string;
  type: 'number' | 'color'; // default is color.
  hidden: boolean;
  dependentKeys: string[];
  fieldSpan: FieldSpan;
  inputSpan: FieldSpan;
  justifyStart: boolean;
  order: number;
  followWithBlanks: BlankFieldInfo[];
}

// TOP COLORS.
interface IconContainerColors<T extends ThemeFormConfig | string = string> {
  background: T;
  iconColor: T;
  borderWidth: T;
  borderColor: T;
}
interface TopBarColors<T extends ThemeFormConfig | string = string> {
  background: T;
  iconColor: T;
  borderBottomWidth: T;
  borderBottomColor: T;

  addressBar: {
    textColor: T;
    textBackground: T;
    locationOrInputBorderWidth: T;
    locationOrInputBorderColor: T;

    addressSeparatorColor: T;
    homeColor: T;
    searchColor: T;

    barBackground: T;
    borderWidth: T;
    borderColor: T;
  };

  pageButtons: IconContainerColors<T>;
  actionButtons: IconContainerColors<T>;
  stateButtons: IconContainerColors<T>;

  stateActnBtnSeparatorWidth: T; // border left of state buttons.
  stateActnBtnSeparatorColor: T;
}

// LEFT COLORS.
interface FolderPinColors<T extends ThemeFormConfig | string = string> {
  background: T;
  textColor: T;

  borderWidth: T;
  borderColor: T;

  backgroundSelected: T;
  textColorSelected: T;

  borderWidthSelected: T;
  borderColorSelected: T;
}
interface LeftBarColors<T extends ThemeFormConfig | string = string> {
  background: T;
  borderRightWidth: T;
  borderRightColor: T;

  fixedFolders: FolderPinColors<T>;
  pinnedFolders: FolderPinColors<T>;
}

interface NodeColors<T extends ThemeFormConfig | string = string> {
  textColor: T;
  background: T;
  borderColor: T;
  borderWidth: T;
  iconColor: T;
}
interface MiddleColors<T extends ThemeFormConfig | string = string> {
  background: T;

  oddSubFolChContainerBgColor: T;
  evenSubFolChContainerBgColor: T;
  rootFolChContainerBgColor: T;
  rootNodeContainerBorderWidth: T;
  rootNodeContainerBorderColor: T;

  folder: NodeColors<T>;
  bookmark: NodeColors<T>;
}

// RIGHT COLORS
interface RightBarColors<T extends ThemeFormConfig | string = string> {
  borderLeftWidth: T;
  borderLeftColor: T;
  background: T;
  textColor: T;
}

// Popup
interface PopupColors<T extends ThemeFormConfig | string = string> {
  topBar: T;
  titleColor: T;
  borderWidth: T;
  borderColor: T;
  borderTitleBottomWidth: T;
  borderTitleBottomColor: T;
}

interface ThemeColors {
  topColors: TopBarColors<string>;
  leftColors: LeftBarColors<string>;
  middleColors: MiddleColors<string>;
  rightColors: RightBarColors<string>;
  popupColors: PopupColors<string>;
}

interface ThemeFormConfigInfo {
  topColors: TopBarColors<ThemeFormConfig>;
  leftColors: LeftBarColors<ThemeFormConfig>;
  middleColors: MiddleColors<ThemeFormConfig>;
  rightColors: RightBarColors<ThemeFormConfig>;
  popupColors: PopupColors<ThemeFormConfig>;
}

type RecursivePartialTheme<T> = {
  [P in keyof T]?: T[P] extends string ? string : RecursivePartialTheme<T[P]>;
};

interface Theme {
  name: string;
  changeId: string;
  themeId: string;
  themeColors: ThemeColors;
}
type PartialTheme = RecursivePartialTheme<Theme>;

export type { PartialTheme, Theme, ThemeColors, ThemeFormConfigInfo, ThemeFormConfig };
