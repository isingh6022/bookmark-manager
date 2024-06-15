import { PayloadAction, createSlice } from '@reduxjs/toolkit';
// prettier-ignore
import {
  RemovedEvent, MovedEvent, ChangedEvent,
  CreatedEvent, ChReordered, ImportEndEvent, DropInfo,
} from '@proj-types';
import { BookmarkService } from '@proj-scripts';

const bookmarkSlice = createSlice({
  name: 'bookmarkSlice',
  initialState: BookmarkService.instance.getInitState(),
  reducers: {
    bookmarkDataInit: (state, action: PayloadAction<string | undefined>) => {
      BookmarkService.instance.setCurrentNode(state, action.payload);
    },

    rmv: (state, action: PayloadAction<string>) => {
      BookmarkService.instance.rmv(state, action.payload);
    },
    mov: (state, action: PayloadAction<MovedEvent['payload']>) => {
      BookmarkService.instance.mov(state, action.payload);
    },
    add: (state, action: PayloadAction<CreatedEvent['payload']>) => {
      BookmarkService.instance.add(state, action.payload);
    },
    chg: (state, action: PayloadAction<ChangedEvent['payload']>) => {
      BookmarkService.instance.chg(state, action.payload);
    },
    ord: (state, action: PayloadAction<ChReordered['payload']>) => {
      BookmarkService.instance.ord(state, action.payload);
    },
    imp: (state, action: PayloadAction<ImportEndEvent['payload']>) => {
      // BookmarkService.instance.imp(state, action.payload);
      return;
    },

    ico: (state, action: PayloadAction<string>) => {
      BookmarkService.instance.ico(state, action.payload);
    },
    rmvIco: (state, action: PayloadAction<string>) => {
      BookmarkService.instance.rmvIco(state, action.payload);
    },

    showNode(state, action: PayloadAction<{ id: string; showInParent?: boolean }>) {
      BookmarkService.instance.showNode(state, action.payload.id, action.payload.showInParent);
    },

    setCurrNode: (state, action: PayloadAction<string>) => {
      BookmarkService.instance.setCurrentNode(state, action.payload);
    },

    selectDeselectNode: (
      state,
      action: PayloadAction<{
        id: string;
        shiftKey?: boolean;
        selectOnly?: boolean;
        deselectOnly?: boolean;
      }>
    ) => {
      BookmarkService.instance.selectDeSelectNode(state, action.payload.id, state.lastSelectedId, {
        ...action.payload
      });
    },
    deselectAll: (state, action: PayloadAction<string | undefined>) => {
      BookmarkService.instance.deselectAllAndUpdateState(state, action.payload);
    },

    dropOver: (state, action: PayloadAction<DropInfo>) => {
      BookmarkService.instance.drop(state, action.payload);
    },

    searchNodes(state, action: PayloadAction<string>) {
      BookmarkService.instance.searchNodes(state, action.payload);
    }
  }
});

export const bookmarkReducer = bookmarkSlice.reducer;

// prettier-ignore
export const {
  bookmarkDataInit, setCurrNode,
  rmv, mov, add, chg, ord, imp,
  ico, rmvIco, showNode,
  selectDeselectNode, deselectAll,
  dropOver,
  searchNodes
} = bookmarkSlice.actions;
