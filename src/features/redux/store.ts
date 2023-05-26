import { configureStore } from '@reduxjs/toolkit';
import editorCurrentProject from '../editor/editorCurrentProjectSlice';

export const store = configureStore({
  devTools: true,
  preloadedState: {
    editorCurrentProject: {
      projectDir: '',
    },
  },
  reducer: {
    editorCurrentProject,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
