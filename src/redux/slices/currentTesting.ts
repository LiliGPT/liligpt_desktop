// --- initial state

import { AnyAction, Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { selectProjectDir } from "./currentProject";
import { rustGetTestScripts, rustRunShellCommand } from "../../services/rust";

interface CurrentTestingScript {
  scriptKey: string;
  scriptValue: string;
  isSuccess: boolean | null;
  isLoading: boolean;
  output: string;
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
    setTestLoadingByIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      return {
        ...state,
        scripts: [
          ...state.scripts!.slice(0, index),
          {
            ...state.scripts![index],
            isLoading: true,
          },
          ...state.scripts!.slice(index + 1),
        ],
      };
    },
    setTestResultByIndex: (state, action: PayloadAction<{ index: number; isSuccess: boolean | null; output: string; }>) => {
      const { index, isSuccess, output } = action.payload;
      return {
        ...state,
        scripts: [
          ...state.scripts!.slice(0, index),
          {
            ...state.scripts![index],
            isSuccess,
            output,
            isLoading: false,
          },
          ...state.scripts!.slice(index + 1),
        ],
      };
    },
  },
});

// --- selectors

export const selectCurrentTesting = (state: RootState) => state.currentTesting;

// --- actions

export const { setCurrentTestingSlice, setLoading, setError, setTestResultByIndex } = currentTestingSlice.actions;

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
      isLoading: false,
      output: '',
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
    for (let i in scripts) {
      await runTestCommand(Number(i))(dispatch, getState);
    }
  } catch (e) {
    dispatch(setError(e as Error));
  }
}

export const runTestCommand = (index: number) => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    // dispatch(setLoading());
    dispatch(currentTestingSlice.actions.setTestLoadingByIndex(index));
    const state = getState();
    const currentTesting = selectCurrentTesting(state);
    const { scriptKey, scriptValue } = currentTesting.scripts![index];
    const projectDir = selectProjectDir(state);
    const output = await rustRunShellCommand(projectDir, `npm run ${scriptKey}`);
    dispatch(setTestResultByIndex({ index, isSuccess: true, output }));
    console.log(`runTestCommand success`);
  } catch (e: any) {
    console.log(`runTestCommand error `, e);
    // dispatch(setError(e as Error));
    dispatch(setTestResultByIndex({ index, isSuccess: false, output: String(e) }));
  }
}

// --- reducer

export default currentTestingSlice.reducer;
