// This reducer will store information about the current project's health

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CodeFramework, CodeLanguage } from "../../services/project/types";

// --- initial state

export interface ProjectHealthState {
  codeLanguage: CodeLanguage | undefined;
  codeFramework: CodeFramework;
}

const initialState: ProjectHealthState = {
  codeLanguage: undefined,
  codeFramework: undefined,
};

// --- slice

export const projectHealthSlice = createSlice({
  name: 'projectHealth',
  initialState,
  reducers: {
    setCodeLanguage: (state: ProjectHealthState, action: PayloadAction<CodeLanguage>) => {
      return {
        ...state,
        codeLanguage: action.payload,
      };
    },
    setCodeFramework: (state: ProjectHealthState, action: PayloadAction<CodeFramework>) => {
      return {
        ...state,
        codeFramework: action.payload,
      };
    },
  },
});

// todo

// --- selectors

// --- actions

// --- thunks

// --- reducer
