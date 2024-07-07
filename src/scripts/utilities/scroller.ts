import { Scroller } from '@proj-types';

export enum ScrollDirection {
  UP = -1,
  DOWN = 1,
  NONE = 0
}

class UtilCopy {
  private static _prevRemSize: number = 0;
  private static _prevFontSize: string = '0';
  private static getRemSize(): number {
    let fs = getComputedStyle(document.documentElement).fontSize;

    if (fs && this._prevRemSize && fs === this._prevFontSize) {
      return this._prevRemSize;
    }
    let size = fs.match(/\d+/g) || ['0'];

    return (this._prevRemSize = parseInt(size[0]) || 14);
  }
  static remToPx(rem: number): number {
    return rem * this.getRemSize();
  }
}

export class ScrollerImpl implements Scroller {
  private _deltaT: number;
  private _deltaHRem: number; // in rem.
  private get _deltaH() {
    return UtilCopy.remToPx(this._deltaHRem);
  }

  private _scrollStartY: number = window.scrollY;
  private _scrollStartTime: number = 0;
  private _scrollDirection: ScrollDirection = ScrollDirection.NONE;

  private _scrollEl: null | HTMLElement | (() => HTMLElement | null) | Window = window;
  get scrollEl() {
    return this._scrollEl;
  }
  set scrollEl(el: HTMLElement | (() => HTMLElement | null) | Window | null) {
    this._scrollEl = el;
  }

  private _intervalId: ReturnType<typeof setInterval> | 0 = 0;

  constructor(speedRemPerSec: number, stepSizeInRem: number) {
    this._deltaT = (1000 * stepSizeInRem) / speedRemPerSec;
    this._deltaT = this._deltaT < 10 ? 10 : this._deltaT;

    this._deltaHRem = (speedRemPerSec * this._deltaT) / 1000;
  }

  startMovingUpwards() {
    this._startMoving(ScrollDirection.UP);
  }
  startMovingDownwards() {
    this._startMoving(ScrollDirection.DOWN);
  }

  stopMoving() {
    clearInterval(this._intervalId);
    this._intervalId = 0;

    this._scrollDirection = ScrollDirection.NONE;
  }

  private _startMoving(direction: ScrollDirection.UP | ScrollDirection.DOWN) {
    if (this._scrollDirection === direction && this._intervalId) return;

    this.stopMoving();
    this._scrollDirection = direction;
    this._intervalId = setInterval(() => this._scroll(), this._deltaT + 1);
  }
  private _scroll() {
    if (!this._isScrolling()) {
      let scrollEl: HTMLElement | null | Window =
        typeof this._scrollEl === 'function' ? this._scrollEl() : this._scrollEl;

      if (scrollEl) {
        this._scrollStartTime = new Date().getTime();
        this._scrollStartY =
          scrollEl === window ? scrollEl.screenTop : (<HTMLElement>scrollEl).scrollTop;

        setTimeout(() => {
          (<any>scrollEl).scrollTo(0, this._scrollStartY + this._scrollDirection * this._deltaH);
        }, this._deltaT);
      }
    }
  }
  private _isScrolling() {
    return (
      this._scrollDirection !== ScrollDirection.NONE &&
      new Date().getTime() < this._scrollStartTime + this._deltaT - 1
    );
  }
}
