import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { DragstartInfo, DropInfo, MODE, PAGES, PopupConfig } from '@proj-types';
import { TransientStateService } from '@proj-scripts';

const transientStateSlice = createSlice({
  name: 'temporaryStateSlice',
  initialState: TransientStateService.instance.getInitState(),
  reducers: {
    page: (state, action: PayloadAction<{ page: PAGES; folder?: string }>) => {
      TransientStateService.instance.setPage(state, {
        page: action.payload.page,
        folderId: action.payload.folder
      });
    },
    mode: (state, action: PayloadAction<MODE>) => {
      TransientStateService.instance.setMode(state, action.payload);
    },

    dragstart: (state, action: PayloadAction<DragstartInfo>) => {
      TransientStateService.instance.dragstart(state, action.payload);
    },
    dragend(state) {
      TransientStateService.instance.dragend(state);
    },
    popup: (state, action: PayloadAction<PopupConfig | null>) => {
      TransientStateService.instance.setPopup(state, action.payload);
    },
    confirm: (state) => {
      TransientStateService.instance.confirm(state);
    }
  }
});

export const transientStateReducer = transientStateSlice.reducer;
export const { page, mode, dragstart, dragend, popup, confirm } = transientStateSlice.actions;
