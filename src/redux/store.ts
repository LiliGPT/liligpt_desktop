import { configureStore } from '@reduxjs/toolkit';
import { currentProjectSlice } from '../redux/slices/currentProject';
import { currentTestingSlice } from './slices/currentTesting';

export const store = configureStore({
  devTools: true,
  preloadedState: {
    currentProject: currentProjectSlice.getInitialState(),
    currentTesting: currentTestingSlice.getInitialState(),
  },
  reducer: {
    currentProject: currentProjectSlice.reducer,
    currentTesting: currentTestingSlice.reducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
