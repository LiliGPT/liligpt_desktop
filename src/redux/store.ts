import { configureStore } from '@reduxjs/toolkit';
import { projectsSlice } from './slices/projectsSlice';
import { renderTreesSlice } from './slices/renderTreesSlice';
import { testsSlice } from './slices/testsSlice';
import { shellTasksSlice } from './slices/shellTasksSlice';
import { shellLogsSlice } from './slices/shellLogsSlice';
import { coreSlice } from './slices/coreSlice';
import { missionsSlice } from './slices/missionsSlice';
import { authSlice } from './slices/authSlice';

export const store = configureStore({
  devTools: true,
  preloadedState: {
    core: coreSlice.getInitialState(),
    auth: authSlice.getInitialState(),
    projects: projectsSlice.getInitialState(),
    tests: testsSlice.getInitialState(),
    renderTrees: renderTreesSlice.getInitialState(),
    shellTasks: shellTasksSlice.getInitialState(),
    shellLogs: shellLogsSlice.getInitialState(),
    missions: missionsSlice.getInitialState(),
  },
  reducer: {
    core: coreSlice.reducer,
    auth: authSlice.reducer,
    projects: projectsSlice.reducer,
    tests: testsSlice.reducer,
    renderTrees: renderTreesSlice.reducer,
    shellTasks: shellTasksSlice.reducer,
    shellLogs: shellLogsSlice.reducer,
    missions: missionsSlice.reducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
