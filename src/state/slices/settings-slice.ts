import { SettingsService } from '@proj-scripts';
import { BkmDisplayOrder, DropInfo, Flow, Theme } from '@proj-types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settingsSlice',
  initialState: SettingsService.instance.getInitState(),
  reducers: {
    settingsDataInit: (state, action: PayloadAction<void>) => {
      SettingsService.instance.initSettingState(state);
    },
    colCount: (state, action: PayloadAction<number>) => {
      SettingsService.instance.setBkmFolderColCount(state, action.payload);
    },
    bkmNodeFlow: (state, action: PayloadAction<Flow>) => {
      SettingsService.instance.setFlowDirection(state, action.payload);
    },
    bkmDispOrder: (state, action: PayloadAction<BkmDisplayOrder>) => {
      SettingsService.instance.setBkmDisplayOrder(state, action.payload);
    },
    setPins: (state, action: PayloadAction<string[]>) => {
      SettingsService.instance.setPinnedFolders(state, action.payload);
    },
    pin: (state, action: PayloadAction<{ id: string; index?: number }>) => {
      SettingsService.instance.addPinnedFolder(state, action.payload.id, action.payload.index);
    },
    editPin: (state, action: PayloadAction<{ id: string; newTitle: string }>) => {
      SettingsService.instance.editPin(state, action.payload.id, action.payload.newTitle);
    },
    homePin: (state, action: PayloadAction<string>) => {
      SettingsService.instance.setHomeFolder(state, action.payload);
    },
    unpin: (state, action: PayloadAction<string>) => {
      SettingsService.instance.unpinFolder(state, action.payload);
    },
    recheckPins: (state, action: PayloadAction<void>) => {
      SettingsService.instance.setPinnedFolders(
        state,
        state.pinnedFolders.map((pin) => pin.id)
      );
    },
    addTheme: (state, action: PayloadAction<{ theme: Theme; setCurrent?: boolean }>) => {
      let themeAdded = SettingsService.instance.addTheme(state, action.payload.theme, false);
      action.payload.setCurrent &&
        themeAdded &&
        SettingsService.instance.setCurrTheme(state, themeAdded.themeId);
    },
    edtTheme: (state, action: PayloadAction<Theme>) => {
      SettingsService.instance.edtTheme(state, action.payload);
    },
    rmvTheme: (state, action: PayloadAction<string>) => {
      SettingsService.instance.rmvTheme(state, action.payload);
    },
    currTheme: (state, action: PayloadAction<string>) => {
      SettingsService.instance.setCurrTheme(state, action.payload);
    },
    dropOverSettings: (state, action: PayloadAction<DropInfo>) => {
      SettingsService.instance.drop(state, action.payload);
    }
  }
});

export const settingsReducer = settingsSlice.reducer;

// prettier-ignore
export const {
  settingsDataInit,
  bkmNodeFlow, bkmDispOrder, colCount,
  pin, editPin, homePin, unpin, setPins, recheckPins,
  addTheme, rmvTheme, currTheme, edtTheme,
  dropOverSettings
} = settingsSlice.actions;
