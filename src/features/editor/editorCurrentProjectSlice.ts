import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';
import { invoke } from "@tauri-apps/api/tauri";

export interface RenderTree {
  id: string;
  name: string;
  children?: readonly RenderTree[];
}

// --- initial state

export type OptionalRenderTree = RenderTree | undefined;

export interface EditorCurrentProjectState {
  projectDir: string;
  renderTree: OptionalRenderTree;
  errorMessage: string;
  isLoading: boolean;
  isSuccess: boolean;
}

const initialState: EditorCurrentProjectState = {
  projectDir: '',
  errorMessage: '',
  renderTree: undefined,
  isLoading: false,
  isSuccess: false,
};

// --- slice

export const currentProject = createSlice({
  name: 'editorCurrentProject',
  initialState,
  reducers: {
    setProjectDir: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        projectDir: action.payload,
      };
    },
    setRenderTree: (state, action: PayloadAction<OptionalRenderTree>) => {
      return {
        ...state,
        renderTree: action.payload,
        errorMessage: '',
        isSuccess: true,
        isLoading: false,
      };
    },
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
    setSuccess: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isSuccess: action.payload,
        errorMessage: '',
      };
    },
  }
});

// --- selectors

export const selectProjectDir = (state: RootState): string => state.editorCurrentProject.projectDir;
// export const selectRenderTree = (state: RootState): RenderTree | undefined => state.editorCurrentProject.renderTree;
export const selectEditorCurrentProject = (state: RootState): EditorCurrentProjectState => state.editorCurrentProject;

// --- actions

export const { setProjectDir, setRenderTree, setError, setLoading, setSuccess } = currentProject.actions;

// --- thunks

export const loadRenderTree = () => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(setLoading());
    const path = selectProjectDir(getState());
    const tree = await invoke("get_file_tree", { path }) as unknown as RenderTree;
    dispatch(setRenderTree(tree));
  } catch (e) {
    dispatch(setError(e as Error));
  }
};

// --- reducer

export default currentProject.reducer;
