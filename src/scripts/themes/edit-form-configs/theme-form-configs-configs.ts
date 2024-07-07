import {
  ThemeFormConfig,
  ThemeColors,
  ThemeFormConfigInfo,
  FieldSpan,
  BlankFieldInfo,
  PartialTheme
} from '@proj-types';

export class ThemeFormConfImpl implements ThemeFormConfig {
  private static _CONF_SET = new Map<string, ThemeFormConfig>();

  type: 'number' | 'color' = 'color';
  dependentKeys: string[] = [];
  formKey: string; // serves as ID

  order = 0;
  hidden = false;

  fieldSpan: FieldSpan = FieldSpan.HALF;
  inputSpan: FieldSpan = FieldSpan.QUARTER;

  justifyStart: boolean = false;
  followWithBlanks: BlankFieldInfo[] = [];

  constructor(
    public formLabel: string,
    formKey: string,
    parentKey?: string
  ) {
    this.formKey = formKey;
    ThemeFormConfImpl._CONF_SET.set(this.formKey, this);

    if (parentKey) {
      let parent = ThemeFormConfImpl._CONF_SET.get(parentKey)!;
      parent.dependentKeys.push(this.formKey);
    }
  }

  setTypeNumber() {
    this.type = 'number';
    return this;
  }
  hide() {
    this.hidden = true;
    return this;
  }
  justifyFlexStart() {
    this.justifyStart = true;
    return this;
  }
  setOrder(order: number) {
    this.order = order;
    this.followWithBlanks.forEach((blank) => (blank.order = this.order));
    return this;
  }
  setFieldSpan(span: FieldSpan) {
    this.fieldSpan = span;
    return this;
  }
  setInputSpan(span: FieldSpan) {
    this.inputSpan = span;
    return this;
  }
  setAddBlanks(blanks: BlankFieldInfo[]) {
    this.followWithBlanks = blanks;
    blanks.forEach((blank) => (blank.order = this.order));
    return this;
  }
}

const getMedBlankField = () => ({
  blank: {},
  value: '',
  label: '',
  span: FieldSpan.HALF,
  inputSpan: FieldSpan.HALF
});
const getWideBlankField = () => ({ ...getMedBlankField(), span: FieldSpan.FULL });

const ThemeFormConf = (formLabel: string, formKey: string, parentKey?: string) =>
  new ThemeFormConfImpl(formLabel, formKey, parentKey);

export function getThemeConfConf(): ThemeFormConfigInfo {
  // prettier-ignore
  const themeConfConf: ThemeFormConfigInfo = {
    topColors: {
      background: ThemeFormConf('Background', 'topColors.background').setOrder(1),
      iconColor: ThemeFormConf('Icon Color', 'topColors.iconColor').setOrder(2).setAddBlanks([getWideBlankField()]),
      borderBottomWidth: ThemeFormConf('Bottom Border', 'topColors.borderBottomWidth').setOrder(10).setTypeNumber(),
      borderBottomColor: ThemeFormConf('', 'topColors.borderBottomColor').justifyFlexStart().setOrder(11).setInputSpan(FieldSpan.HALF),

      addressBar: {
        textColor: ThemeFormConf('Text Color', 'topColors.addressBar.textColor', '').setOrder(1),
        textBackground: ThemeFormConf('Text Background', 'topColors.addressBar.textBackground', '').setOrder(2),
        locationOrInputBorderWidth: ThemeFormConf('Address Bar Border', 'topColors.addressBar.locationOrInputBorderWidth', '').setOrder(10).setTypeNumber(),
        locationOrInputBorderColor: ThemeFormConf('', 'topColors.addressBar.locationOrInputBorderColor', '').setOrder(11).justifyFlexStart().setInputSpan(FieldSpan.HALF),

        addressSeparatorColor: ThemeFormConf('Separator Color (>)', 'topColors.addressBar.addressSeparatorColor', 'topColors.addressBar.textColor').setOrder(3),
        homeColor: ThemeFormConf('Home Color', 'topColors.addressBar.homeColor', 'topColors.iconColor').setOrder(5),
        searchColor: ThemeFormConf('Search Color', 'topColors.addressBar.searchColor', 'topColors.iconColor').setOrder(6).setAddBlanks([getWideBlankField()]),

        barBackground: ThemeFormConf('Background', 'topColors.addressBar.barBackground', 'topColors.background').setOrder(4).setAddBlanks([getWideBlankField()]),
        borderWidth: ThemeFormConf('Border', 'topColors.addressBar.borderWidth', '').setOrder(12).setTypeNumber(),
        borderColor: ThemeFormConf('', 'topColors.addressBar.borderColor', '').setOrder(13).justifyFlexStart().setInputSpan(FieldSpan.HALF)
      },
      pageButtons: {
        borderWidth: ThemeFormConf('Border', 'topColors.pageButtons.borderWidth', '').setOrder(10).setTypeNumber(),
        borderColor: ThemeFormConf('', 'topColors.pageButtons.borderColor', '').setOrder(11).justifyFlexStart().setInputSpan(FieldSpan.HALF),
        background: ThemeFormConf('Background', 'topColors.pageButtons.background', 'topColors.background').setAddBlanks([getMedBlankField()]),
        iconColor: ThemeFormConf('Icon Color', 'topColors.pageButtons.iconColor', 'topColors.iconColor').setAddBlanks([getMedBlankField()])
      },
      actionButtons: {
        borderWidth: ThemeFormConf('Border', 'topColors.actionButtons.borderWidth', '').setOrder(10).setTypeNumber(),
        borderColor: ThemeFormConf('', 'topColors.actionButtons.borderColor', '').setOrder(11).justifyFlexStart().setInputSpan(FieldSpan.HALF),
        background: ThemeFormConf('Background', 'topColors.actionButtons.background', 'topColors.background').setAddBlanks([getMedBlankField()]),
        iconColor: ThemeFormConf('Icon Color', 'topColors.actionButtons.iconColor', 'topColors.iconColor').setAddBlanks([getMedBlankField()])
      },
      stateButtons: {
        borderWidth: ThemeFormConf('Border', 'topColors.stateButtons.borderWidth', '').setOrder(10).setTypeNumber(),
        borderColor: ThemeFormConf('', 'topColors.stateButtons.borderColor', '').setOrder(11).justifyFlexStart().setInputSpan(FieldSpan.HALF),
        background: ThemeFormConf('Background', 'topColors.stateButtons.background', 'topColors.background').setAddBlanks([getMedBlankField()]),
        iconColor: ThemeFormConf('Icon Color', 'topColors.stateButtons.iconColor', 'topColors.iconColor').setAddBlanks([getMedBlankField()])
      },

      stateActnBtnSeparatorWidth: ThemeFormConf('Corner Button Separator', 'topColors.stateActnBtnSeparatorWidth', '').setOrder(12).setTypeNumber(),
      stateActnBtnSeparatorColor: ThemeFormConf('', 'topColors.stateActnBtnSeparatorColor', 'topColors.stateButtons.borderColor').setOrder(13).justifyFlexStart().setInputSpan(FieldSpan.HALF),
    },
    leftColors: {
      background: ThemeFormConf('Background', 'leftColors.background').setAddBlanks([getMedBlankField()]),
      borderRightWidth: ThemeFormConf('Right Border', 'leftColors.borderRightWidth').setOrder(10).setTypeNumber(),
      borderRightColor: ThemeFormConf('', 'leftColors.borderRightColor').justifyFlexStart().setOrder(11).justifyFlexStart().setInputSpan(FieldSpan.HALF),

      fixedFolders: {
        borderWidth: ThemeFormConf('Border', 'leftColors.fixedFolders.borderWidth', '').setOrder(3).setTypeNumber(),
        borderColor: ThemeFormConf('', 'leftColors.fixedFolders.borderColor', '').setOrder(4).justifyFlexStart().setInputSpan(FieldSpan.HALF).setAddBlanks([getWideBlankField()]),
        background: ThemeFormConf('Background', 'leftColors.fixedFolders.background').setOrder(2),
        textColor: ThemeFormConf('Text', 'leftColors.fixedFolders.textColor').setOrder(1),

        borderWidthSelected: ThemeFormConf('Border (selected)', 'leftColors.fixedFolders.borderWidthSelected', '').setTypeNumber().setOrder(12),
        borderColorSelected: ThemeFormConf('', 'leftColors.fixedFolders.borderColorSelected', '').setOrder(13).justifyFlexStart().setInputSpan(FieldSpan.HALF),
        backgroundSelected: ThemeFormConf('Background (selected)', 'leftColors.fixedFolders.backgroundSelected').setOrder(11),
        textColorSelected: ThemeFormConf('Text Color (selected)', 'leftColors.fixedFolders.textColorSelected').setOrder(10)
      },
      pinnedFolders: {
        borderWidth: ThemeFormConf('Border', 'leftColors.pinnedFolders.borderWidth', '').setOrder(3).setTypeNumber(),
        borderColor: ThemeFormConf('', 'leftColors.pinnedFolders.borderColor', '').justifyFlexStart().setOrder(4).setInputSpan(FieldSpan.HALF).setAddBlanks([getWideBlankField()]),
        background: ThemeFormConf('Background', 'leftColors.pinnedFolders.background').setOrder(2),
        textColor: ThemeFormConf('Text', 'leftColors.pinnedFolders.textColor').setOrder(1),

        borderWidthSelected: ThemeFormConf('Border (selected)', 'leftColors.pinnedFolders.borderWidthSelected', '').setTypeNumber().setOrder(12),
        borderColorSelected: ThemeFormConf('', 'leftColors.pinnedFolders.borderColorSelected', '').setOrder(13).justifyFlexStart().setInputSpan(FieldSpan.HALF),
        backgroundSelected: ThemeFormConf('Background (selected)', 'leftColors.pinnedFolders.backgroundSelected').setOrder(11),
        textColorSelected: ThemeFormConf('Text Color (selected)', 'leftColors.pinnedFolders.textColorSelected').setOrder(10)
      }
    },
    middleColors: {
      background: ThemeFormConf('Background', 'middleColors.background').setOrder(0).setAddBlanks([getMedBlankField()]),

      oddSubFolChContainerBgColor: ThemeFormConf('Sub Folder Background (odd)', 'middleColors.oddSubFolChContainerBgColor').setOrder(4),
      evenSubFolChContainerBgColor: ThemeFormConf('Sub Folder Background (even)', 'middleColors.evenSubFolChContainerBgColor').justifyFlexStart().setOrder(5),
      rootFolChContainerBgColor: ThemeFormConf('Folder Channel Background', 'middleColors.rootFolChContainerBgColor').setOrder(1).hide(),
      rootNodeContainerBorderWidth: ThemeFormConf('Folder Channel Border', 'middleColors.rootNodeContainerBorderWidth').setOrder(2).setTypeNumber(),
      rootNodeContainerBorderColor: ThemeFormConf('', 'middleColors.rootNodeContainerBorderColor').justifyFlexStart().setInputSpan(FieldSpan.HALF).setOrder(3).setAddBlanks([getWideBlankField()]),

      folder: {
        textColor: ThemeFormConf('Text Color', 'middleColors.folder.textColor').setOrder(1),
        background: ThemeFormConf('Background', 'middleColors.folder.background').setOrder(3).setAddBlanks([getMedBlankField()]),
        borderWidth: ThemeFormConf('Border Bottom', 'middleColors.folder.borderWidth').setTypeNumber().setOrder(4),
        borderColor: ThemeFormConf('', 'middleColors.folder.borderColor').justifyFlexStart().setInputSpan(FieldSpan.HALF).setOrder(5),
        iconColor: ThemeFormConf('Icon Color', 'middleColors.folder.iconColor').setOrder(2)
      },
      bookmark: {
        textColor: ThemeFormConf('Text Color', 'middleColors.bookmark.textColor').setOrder(1),
        background: ThemeFormConf('Background', 'middleColors.bookmark.background').setOrder(3).setAddBlanks([getMedBlankField()]),
        borderWidth: ThemeFormConf('Border Bottom', 'middleColors.bookmark.borderWidth').setTypeNumber().setOrder(4),
        borderColor: ThemeFormConf('', 'middleColors.bookmark.borderColor').justifyFlexStart().setInputSpan(FieldSpan.HALF).setOrder(5),
        iconColor: ThemeFormConf('Icon Color', 'middleColors.bookmark.iconColor').setOrder(2)
      }
    },
    rightColors: {
      background: ThemeFormConf('Background', 'rightColors.background').setOrder(2),
      textColor: ThemeFormConf('Text Color', 'rightColors.textColor').setOrder(1),
      borderLeftWidth: ThemeFormConf('Left Border', 'rightColors.borderLeftWidth').setTypeNumber().setOrder(3),
      borderLeftColor: ThemeFormConf('', 'rightColors.borderLeftColor').justifyFlexStart().setOrder(4)
    },
    popupColors: {
      topBar: ThemeFormConf('Title Background', 'popupColors.topBar').setOrder(1),
      titleColor: ThemeFormConf('Title Color', 'popupColors.titleColor').setOrder(2),
      borderWidth: ThemeFormConf('Popup Border', 'popupColors.borderWidth').setTypeNumber().setOrder(3),
      borderColor: ThemeFormConf('', 'popupColors.borderColor').setOrder(4).setInputSpan(FieldSpan.HALF).justifyFlexStart(),
      borderTitleBottomWidth: ThemeFormConf('Title Border','popupColors.borderTitleBottomWidth').setTypeNumber().setOrder(5),
      borderTitleBottomColor: ThemeFormConf('','popupColors.borderTitleBottomColor').setOrder(6).setInputSpan(FieldSpan.HALF).justifyFlexStart()
    }
  };
  return themeConfConf;
}

export function setPropertyFromFormKey(themeColors: ThemeColors, formKey: string, value: string) {
  let path = formKey.split('.'),
    i = 0,
    parentRef: any = themeColors;

  while (path[i + 1]) parentRef = parentRef[path[i++]!];

  if (parentRef[path[path.length - 1]!]) {
    parentRef[path[path.length - 1]!] = value;
  }
}

export function getPropertyFromFormKey(
  themeColors: PartialTheme['themeColors'],
  formKey: string
): string | undefined {
  let path = formKey.split('.'),
    i = 0,
    prop: any = themeColors;

  const isBorderWidthProp = (val: any): boolean =>
    typeof val === 'string' && val.indexOf('px') !== -1;

  while (i < path.length && prop) prop = prop[path[i++]!];

  if (!prop) return;

  if (isBorderWidthProp(prop)) {
    prop = typeof prop === 'string' && prop.replace(/\d+px\s+solid\s*/, '');
  }

  return prop;
}

export function getThemeFieldConf(formKey: string): ThemeFormConfig | null | undefined {
  let conf: any = getThemeConfConf();

  try {
    let props = formKey.split('.'),
      i = 0,
      val = conf;
    while (i < props.length) conf = conf[props[i++]!];

    return props.length >= 2 ? conf : null;
  } catch (err) {
    return null;
  }
}

const GR_TITLE_MAP: { [key: string]: string } = {
  addressBar: 'Address Bar',
  pageButtons: 'Page Buttons',
  actionButtons: 'Action Buttons',
  stateButtons: 'State Buttons',

  fixedFolders: 'Fixed Folders',
  pinnedFolders: 'Pinned Folders',

  folder: 'Folder',
  bookmark: 'Bookmark'
};
export function getGroupTitleFromKey(key: string): string {
  return GR_TITLE_MAP[key]!;
}
