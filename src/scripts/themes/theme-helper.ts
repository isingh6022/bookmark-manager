import { PartialTheme, Theme, ThemeColors } from '@proj-types';
import {
  getBlankTheme,
  getClassicYellowTheme,
  getIslandBeachTheme,
  getTealTheme,
  getDarkTheme
} from './default-themes/default-themes.js';
import { THEME_CONST } from '@proj-const';
import {
  getTopThemeCSS,
  getLeftThemeCSS,
  getMiddleThemeCSS,
  getRightThemeCSS,
  getPopupThemeCSS
} from './css-gen/css-gen.js';
import { getThemeColorsFormConfigs } from './edit-form-configs/theme-form-configs.js';
import {
  getPropertyFromFormKey,
  getThemeFieldConf,
  setPropertyFromFormKey
} from './edit-form-configs/theme-form-configs-configs.js';

const head = document.head || document.getElementsByTagName('head')[0],
  style = document.createElement('style');

style.setAttribute('type', 'text/css');
head.appendChild(style);

export class ThemeHelper {
  static blankThemeId = THEME_CONST.blankTheme.id;

  static getThemeChangeId(): string {
    return performance.now() + '' + Math.random();
  }

  static parseTheme(theme: PartialTheme): Theme {
    return {
      name: theme.name || THEME_CONST.defaults.unnamed,
      changeId: this.getThemeChangeId(),
      themeId: theme.themeId || '',
      themeColors: this._parseThemeColors(theme.themeColors)
    };
  }
  static getBlankTheme(): Theme {
    return {
      name: THEME_CONST.blankTheme.name,
      changeId: this.blankThemeId,
      themeId: this.blankThemeId,
      themeColors: getBlankTheme()
    };
  }

  static getDefaultThemes(): Theme[] {
    const blankTheme = this.getBlankTheme();
    blankTheme.name = THEME_CONST.blankTheme.name;

    const classicYellow: Theme = {
      name: THEME_CONST.classicYellow.name,
      changeId: THEME_CONST.classicYellow.id,
      themeId: THEME_CONST.classicYellow.id,
      themeColors: getClassicYellowTheme()
    };

    const islandBeach: Theme = {
      name: THEME_CONST.islandBeach.name,
      changeId: THEME_CONST.islandBeach.id,
      themeId: THEME_CONST.islandBeach.id,
      themeColors: getIslandBeachTheme()
    };

    const teal: Theme = {
      name: THEME_CONST.teal.name,
      changeId: THEME_CONST.teal.id,
      themeId: THEME_CONST.teal.id,
      themeColors: getTealTheme()
    };

    const darkMode: Theme = {
      name: THEME_CONST.dark.name,
      changeId: THEME_CONST.dark.id,
      themeId: THEME_CONST.dark.id,
      themeColors: getDarkTheme()
    };

    // The first theme is added to the initial state of the settings slice.
    return [classicYellow, islandBeach, teal, darkMode, blankTheme];
  }

  private static _parseThemeColors(themeColors?: PartialTheme['themeColors']): ThemeColors {
    if (!themeColors) {
      return getBlankTheme();
    }

    return this._getOverriddenBlankTheme(themeColors)!;
  }

  private static _getOverriddenBlankTheme(
    partialThemeColors: PartialTheme['themeColors'],
    blankTheme = getBlankTheme(),
    currBaseKey = ''
  ) {
    if (!partialThemeColors) {
      return blankTheme;
    }
    let currBase = currBaseKey ? getPropertyFromFormKey(blankTheme, currBaseKey) : blankTheme;

    if (typeof currBase === 'string') {
      let overwriteVal = getPropertyFromFormKey(partialThemeColors, currBaseKey);
      if (overwriteVal) {
        setPropertyFromFormKey(blankTheme, currBaseKey, overwriteVal);

        let conf = getThemeFieldConf(currBaseKey);
        conf &&
          conf.dependentKeys.forEach((key) =>
            setPropertyFromFormKey(blankTheme, key, overwriteVal!)
          );
      }

      return;
    }

    for (let key in currBase) {
      this._getOverriddenBlankTheme(
        partialThemeColors,
        blankTheme,
        currBaseKey + (currBaseKey ? '.' : '') + key
      );
    }

    return blankTheme;
  }

  private static _getThemeCss(theme: Theme): string {
    return `
    ${getTopThemeCSS(theme.themeColors.topColors)}

    ${getLeftThemeCSS(theme.themeColors.leftColors)}

    ${getMiddleThemeCSS(theme.themeColors.middleColors)}

    ${getRightThemeCSS(theme.themeColors.rightColors)}

    ${getPopupThemeCSS(theme.themeColors.popupColors)}
    `;
  }
  private static _setThemeCSS(css: string): void {
    while (style.childNodes[0]) style.removeChild(style.childNodes[0]);
    style.appendChild(document.createTextNode(css));
  }

  private static _lastThemeChangeId: string = '';
  static showTheme(theme: Theme): void {
    if (this._lastThemeChangeId === theme.changeId) {
      return;
    } else {
      this._lastThemeChangeId = theme.changeId;
    }

    let css = this._getThemeCss(theme);
    this._setThemeCSS(css);
  }

  static getThemeFormProps(theme: Theme, afterChangeCallback: Function, disabled = false) {
    return getThemeColorsFormConfigs(theme.themeColors, afterChangeCallback, disabled);
  }
}
