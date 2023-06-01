import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ReduxShellLog {
  shellTaskUid: string;
  message: string;
  timestamp: number;
  type: 'normal' | 'internal' | 'error';
}

type ReduxShellLogsState = ReduxShellLog[];

const initialState: ReduxShellLogsState = [];

// --- slice

export const shellLogsSlice = createSlice({
  name: 'shellLogs',
  initialState,
  reducers: {
    addShellLog: (state: ReduxShellLogsState, action: PayloadAction<ReduxShellLog>) => {
      const newState = [...state];
      newState.push(action.payload);
      return newState;
    },
  },
});

// --- selectors

export const selectShellLogsByShellTaskId = (shellTaskUid: string) => (state: RootState): ReduxShellLog[] => {
  return state.shellLogs.filter(shellLog => shellLog.shellTaskUid === shellTaskUid);
};

// --- actions

export const { addShellLog } = shellLogsSlice.actions;
