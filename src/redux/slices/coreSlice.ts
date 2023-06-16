import { createSlice } from "@reduxjs/toolkit";

export enum ReduxCoreView {
  CodeProjects,
  MissionsHistory,
}

interface ReduxCoreState {
  view: ReduxCoreView;
}

const initialState: ReduxCoreState = {
  // initial app page
  view: ReduxCoreView.CodeProjects,
};

// --- slice

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    setCoreView: (state: ReduxCoreState, action: { payload: ReduxCoreView }) => {
      return {
        ...state,
        view: action.payload,
      };
    },
  },
});

// --- selectors

export const selectCoreView = (state: { core: ReduxCoreState }): ReduxCoreView => {
  return state.core.view;
}

// --- actions

export const { setCoreView } = coreSlice.actions;
