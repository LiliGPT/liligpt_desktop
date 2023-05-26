import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';

export interface EditorCurrentProjectState {
  projectDir: string;
}

// Define the initial state using that type
const initialState: EditorCurrentProjectState = {
  projectDir: '',
}

export const currentProject = createSlice({
  name: 'editorCurrentProject',
  initialState,
  reducers: {
    setProjectDir: (state, action: PayloadAction<string>) => {
      state.projectDir = action.payload;
    },
  }
})

export const { setProjectDir } = currentProject.actions

// Other code such as selectors can use the imported `RootState` type
export const selectProjectDir = (state: RootState) => state.editorCurrentProject.projectDir;

export default currentProject.reducer
