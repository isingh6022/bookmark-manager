import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GenericClassCSS,
  MinorElementsRefCSS,
  PopupElementsRefCSS,
  THEME_CONST
} from '@proj-const';
import { ThemeHelper, Util } from '@proj-scripts';
import {
  AppDispatchType,
  ReduxSelectorForArrOfElements,
  RootStateType,
  addTheme,
  edtTheme,
  currTheme as setCurrThemeEvent
} from '@proj-state';
import {
  BlankFieldInfo,
  ColorFieldInfo,
  DropDownFieldInfo,
  FieldGroupProps,
  FieldInfo,
  FieldProps,
  FieldSpan,
  NumberFieldInfo,
  Theme,
  ThemePopup
} from '@proj-types';
import { BsCaretRightFill, FiPlusCircle } from '../project-icons.js';
import { FieldWithLabel } from '../util-components/input.js';
import { InputGroup } from '../util-components/input-group.js';

type T = [Theme, Theme[]];
const themePopupSelector = new ReduxSelectorForArrOfElements(
  (state: RootStateType): T => [state.settings.currTheme, state.settings.themes]
).selector;

const ThemeField: React.FC<{
  creating: boolean;
  setCreating: (creating: boolean) => void;
  create: (newName: string) => void;
}> = ({ creating, setCreating, create }) => {
  const dispatch = useDispatch<AppDispatchType>();
  const [currTheme, themes] = useSelector<RootStateType, T>(themePopupSelector);
  const [newThemeDetails, setNewThemeDetails] = useState({
    name: '',
    warning: ''
  });

  const dropdownOptions = themes
    .map((theme) => ({ key: theme.themeId, text: theme.name }))
    .sort((th1, th2) => {
      if (th1.text === th2.text) return 0; // should not happen.

      return th1.text < th2.text ? -1 : 1;
    });
  const newThemeNameChange = (newVal: string) => {
    let warning = '',
      name = newVal;
    for (let theme of themes) {
      if (theme.name.toLowerCase() === (newVal + '').toLowerCase()) {
        warning = 'Name already exists';
      }
    }

    setNewThemeDetails({ warning, name });
  };
  const selectCurrent = (currThemeName: string) => {
    dispatch(setCurrThemeEvent(currThemeName));
  };

  const commonProps = {
    span: FieldSpan.FULL,
    inputSpan: FieldSpan.HALF,
    labelSpan: FieldSpan.HALF
  };
  const fieldProps: FieldProps<string, DropDownFieldInfo | FieldInfo> = creating
    ? {
        name: 'new-theme-name',
        info: {
          value: newThemeDetails.name,
          label: 'New Theme Name: ',
          ...commonProps
        },
        onChange: newThemeNameChange
      }
    : {
        name: 'theme-selector',
        info: {
          dropdown: {
            options: dropdownOptions
          },
          value: currTheme.themeId,
          label: 'Current Theme: ',
          ...commonProps
        },
        onChange: selectCurrent
      };

  const onSaveOrCreateClick = () => {
    if (creating) {
      if (!newThemeDetails.name) {
        setNewThemeDetails({ name: '', warning: 'Enter a unique theme name.' });
      } else if (!newThemeDetails.warning) {
        create(newThemeDetails.name);
        setCreating(false);
      }
    } else {
      setCreating(true);
    }
  };
  const onCancelClick = () => {
    setCreating(false);
  };

  return (
    <div id={PopupElementsRefCSS.THEME_FIELD_FORM_ID}>
      <FieldWithLabel {...fieldProps} />
      <div className={PopupElementsRefCSS.THEME_POPUP_WARN}>
        {creating && newThemeDetails.warning}
      </div>
      {creating ? (
        <>
          <button onClick={onSaveOrCreateClick}>
            <span>Save</span>
          </button>
          <button onClick={onCancelClick}>Cancel</button>
        </>
      ) : (
        <button onClick={onSaveOrCreateClick}>
          <FiPlusCircle />
          <span>Create</span>
        </button>
      )}
    </div>
  );
};

//
enum ThemeSection {
  TOP = 'TOP',
  LFT = 'LFT',
  MID = 'MID',
  RGT = 'RGT',
  NUL = 'NUL',
  POP = 'POP'
}

type PropType1 = FieldProps<string, ColorFieldInfo | NumberFieldInfo | BlankFieldInfo>;
type PropType2 = FieldGroupProps;
const isFieldProp = (prop: PropType1 | PropType2): prop is PropType1 => {
  return !(prop as any).groupFieldsInfo;
};
export const ThemePopupComponent: React.FC<ThemePopup> = ({}) => {
  const currTheme = useSelector<RootStateType, Theme>((state) => state.settings.currTheme);
  const dispatch = useDispatch<AppDispatchType>();

  const [currSec, setCurrSec] = useState(ThemeSection.MID);
  const [creating, setCreating] = useState(false);
  const create = (newThemeName: string) => {
    const newThemeRef = Util.misc.cloneSerializable(currTheme);
    newThemeRef.changeId = '';
    newThemeRef.themeId = '';
    newThemeRef.name = newThemeName;
    dispatch(addTheme({ theme: newThemeRef, setCurrent: true }));
  };

  const getFormProps = () => {
    const editableThemeRef = Util.misc.cloneSerializable(currTheme);
    const formProps = ThemeHelper.getThemeFormProps(
      editableThemeRef,
      () => {
        dispatch(edtTheme(editableThemeRef));
      },
      THEME_CONST.permanentThemeIds.has(currTheme.themeId)
    );

    const forms = [
      { form: formProps.topColors, displaySection: ThemeSection.TOP, name: 'Top Bar' },
      { form: formProps.middleColors, displaySection: ThemeSection.MID, name: 'Middle' },
      { form: formProps.leftColors, displaySection: ThemeSection.LFT, name: 'Left Panel' },
      { form: formProps.rightColors, displaySection: ThemeSection.RGT, name: 'Right Panel' },
      { form: formProps.popupColors, displaySection: ThemeSection.POP, name: 'Popup' }
    ];

    return forms;
  };
  const editWarn =
    THEME_CONST.permanentThemeIds.has(currTheme.themeId) && !creating
      ? 'Not editable: This is a default theme. Create a new one to edit it.'
      : '';

  return (
    <div>
      <ThemeField {...{ creating, setCreating, create }} />

      <div className={PopupElementsRefCSS.THEME_POPUP_WARN}>{editWarn}</div>

      {creating
        ? []
        : getFormProps().map((form) => {
            return (
              <div key={form.displaySection}>
                <h1
                  onClick={(e) =>
                    setCurrSec(
                      currSec === form.displaySection ? ThemeSection.NUL : form.displaySection
                    )
                  }
                >
                  <BsCaretRightFill
                    className={currSec === form.displaySection ? GenericClassCSS.ROT_90_CLOC : ''}
                  />
                  {form.name}
                </h1>
                <div
                  className={MinorElementsRefCSS.FORM_ELEMENTS_CONT}
                  style={{ display: currSec === form.displaySection ? 'flex' : 'none' }}
                >
                  {form.form.map((formElProps) => {
                    return isFieldProp(formElProps) ? (
                      <FieldWithLabel {...formElProps} key={formElProps.name} />
                    ) : (
                      <InputGroup {...formElProps} key={formElProps.title} />
                    );
                  })}
                </div>
              </div>
            );
          })}
    </div>
  );
};
