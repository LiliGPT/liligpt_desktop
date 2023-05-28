import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { OptionalRenderTree, ProjectFromRust, rustGetFileTree, rustOpenProject } from '../../services/rust';

// --- initial state

export interface CurrentProjectState {
  projectDir: string;
  displayName: string;
  codeLanguage: string;
  framework: string;
  renderTree: OptionalRenderTree;
  errorMessage: string;
  isLoading: boolean;
  isSuccess: boolean;
}

const initialState: CurrentProjectState = {
  projectDir: '',
  displayName: '',
  errorMessage: '',
  codeLanguage: '',
  framework: '',
  renderTree: undefined,
  isLoading: false,
  isSuccess: false,
};
// const initialState: CurrentProjectState = {
//   projectDir: '/home/l/dasa/sigo/v2',
//   displayName: 'v2',
//   errorMessage: '',
//   renderTree: undefined,
//   isLoading: false,
//   isSuccess: false,
// };

// --- slice

export const currentProjectSlice = createSlice({
  name: 'currentProject',
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
    setProjectFromRust: (state, action: PayloadAction<ProjectFromRust>) => {
      return {
        ...state,
        projectDir: action.payload.project_dir,
        codeLanguage: action.payload.code_language,
        framework: action.payload.framework,
      };
    },
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
        displayName: action.payload?.name ?? '',
        errorMessage: '',
        isSuccess: true,
        isLoading: false,
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

export const selectProjectDir = (state: RootState): string => state.currentProject.projectDir;
// export const selectRenderTree = (state: RootState): RenderTree | undefined => state.currentProject.renderTree;
export const selectCurrentProject = (state: RootState): CurrentProjectState => state.currentProject;

// --- actions

export const { setProjectDir, setRenderTree, setError, setLoading, setSuccess } = currentProjectSlice.actions;

// --- thunks

export const openProjectThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(setLoading());
    const projectFromRust = await rustOpenProject();
    dispatch(currentProjectSlice.actions.setProjectFromRust(projectFromRust));
    const tree = await rustGetFileTree(projectFromRust.project_dir);
    dispatch(setRenderTree(tree));
  } catch (e) {
    dispatch(setError(e as Error));
  }
}

export const loadRenderTreeThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(setLoading());
    const projectDir = selectProjectDir(getState());
    // setTimeout(() => dispatch(setError(`cheguei`)), 1500);
    const tree = await rustGetFileTree(projectDir);
    dispatch(setRenderTree(tree));
  } catch (e) {
    // alert("[003j9] " + JSON.stringify(e));
    dispatch(setError(e as Error));
  }
};

// --- reducer

export default currentProjectSlice.reducer;
