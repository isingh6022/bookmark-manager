import { CTX_MENU_TOLLERANCE, LayoutRefCSS } from '@proj-const';
import { MiscUtil } from './misc-util.js';
import { Position } from '@proj-types';

export class CtxMenuUtil {
  static ctxMenuPosn(x: number, y: number, optionCount: number) {
    if (!optionCount) return '';
    /**
     * Ctx menu width is set using css. But aprox. tolerances
     * have been defined in constants.
     * Also, height of one ctx menu item is taken as 1.8 rem.
     */
    let rem = MiscUtil.getRemSize(),
      h0 = window.innerHeight,
      w0 = window.innerWidth;
    let moveLeft = MiscUtil.remToPx(CTX_MENU_TOLLERANCE.Right) > w0 - x,
      moveUp =
        MiscUtil.remToPx(CTX_MENU_TOLLERANCE.Bottom) >
        h0 - (MiscUtil.remToPx(optionCount * 1.8) + y);

    return `${moveLeft ? LayoutRefCSS.CTX_MENU_SHIFT_LEFT : ''} ${
      moveUp ? LayoutRefCSS.CTX_MENU_SHIFT_UP : ''
    }`.trim();
  }

  private static _currCloseMenuFn: () => void = () => {};
  private static _removePreviousListeners() {
    let currListener = this._currCloseMenuFn;
    setTimeout(
      () => (
        window.removeEventListener('click', currListener),
        window.removeEventListener('wheel', currListener),
        window.removeEventListener('contextmenu', currListener)
      ),
      1000
    );
  }
  private static _addListeners(closeMenu: () => void) {
    this._removePreviousListeners();
    this._currCloseMenuFn = closeMenu;

    window.addEventListener('click', this._currCloseMenuFn),
      window.addEventListener('wheel', this._currCloseMenuFn),
      window.addEventListener('contextmenu', this._currCloseMenuFn);
  }
  private static _removeListener(listener: () => void) {
    window.removeEventListener('click', listener),
      window.removeEventListener('wheel', listener),
      window.removeEventListener('contextmenu', listener);
  }

  /**
   * Decorates the function to close the menu and adds events listeners to window
   * to close the menu on click, wheel and contextmenu.
   *
   * @param closeMenu Function to close the menu.
   * @returns A decorated version of the close menu function.
   */
  static decorateCloseMenuMethod(closeMenu: () => void) {
    let calledFirstTime = false,
      menuRemoved = false;

    const closeMenuWithCheck = () => {
      if (!calledFirstTime) {
        calledFirstTime = true;
        return;
      }
      if (!menuRemoved) {
        this._removeListener(closeMenuWithCheck);
        closeMenu();
        menuRemoved = true;
      }
    };
    this._addListeners(closeMenuWithCheck);

    return closeMenuWithCheck;
  }
}
