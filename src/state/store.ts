import { configureStore } from '@reduxjs/toolkit';
import { BookmarkService, SettingsService } from '@proj-scripts';
import { bookmarkDataInit, refreshBkmState, setCurrNode } from './slices/bkm-slice.js';
import { settingsDataInit } from './slices/settings-slice.js';
import {
  bookmarkReducer as bookmarks,
  settingsReducer as settings,
  transientStateReducer as transient
} from './slices/reducers.js';

export const STORE = configureStore({ reducer: { bookmarks, settings, transient } });

let settInit = false,
  bkmInit = false;

const afterSettInit = () => {
  let home = SettingsService.instance.getHomeFolder();

  STORE.dispatch(settingsDataInit());
  home && STORE.dispatch(setCurrNode(home));
};

BookmarkService.instance.afterInit(() => {
  bkmInit = true;
  STORE.dispatch(bookmarkDataInit());

  if (settInit) {
    afterSettInit();
  }
});
SettingsService.instance.afterInit(() => {
  settInit = true;

  if (bkmInit) {
    afterSettInit();
  }
});

BookmarkService.instance.onBrowserUpdate(() => STORE.dispatch(refreshBkmState()));

export type RootStateType = ReturnType<typeof STORE.getState>;
export type AppDispatchType = typeof STORE.dispatch;
