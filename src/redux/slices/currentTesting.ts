// --- initial state

import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { selectProjectDir } from "./currentProject";
import { rustGetTestScripts } from "../../services/rust";

interface CurrentTestingScript {
  scriptKey: string;
  scriptValue: string;
  isSuccess: boolean | null;
  coverage: number;
  coverageFolder: string;
}

export interface CurrentTestingState {
  totalCoverage: number;
  isLoading: boolean;
  errorMessage: string;
  scripts: CurrentTestingScript[] | undefined,
}

const initialState: CurrentTestingState = {
  totalCoverage: 0,
  isLoading: false,
  errorMessage: '',
  scripts: undefined,
};

// --- slice

export const currentTestingSlice = createSlice({
  name: 'currentTesting',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | Error>) => {
      const errorMessage: string = action.payload instanceof Error ? action.payload.message : action.payload;
      return {
        ...state,
        errorMessage,
        isSuccess: false,
        isLoading: false,
      };
    },
    setLoading: (state, action: PayloadAction<undefined>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    setCurrentTestingSlice: (state, action: PayloadAction<CurrentTestingState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

// --- selectors

export const selectCurrentTesting = (state: RootState) => state.currentTesting;

// --- actions

export const { setCurrentTestingSlice, setLoading, setError } = currentTestingSlice.actions;

// --- thunks

export const fetchCurrentTestingScripts = () => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(setLoading());
    const projectDir = selectProjectDir(getState());
    const testScripts = await rustGetTestScripts(projectDir);
    const scripts: CurrentTestingScript[] = Object.keys(testScripts).map(script => ({
      scriptKey: script,
      scriptValue: testScripts[script],
      isSuccess: null,
      coverage: 0,
      coverageFolder: '',
    }));
    const newCurrentTest: CurrentTestingState = {
      totalCoverage: 23,
      isLoading: false,
      errorMessage: '',
      scripts,
    };
    dispatch(setCurrentTestingSlice(newCurrentTest));
    // todo next: --- run_shell_command here
  } catch (e) {
    dispatch(setError(e as Error));
  }
}

// --- reducer

export default currentTestingSlice.reducer;
