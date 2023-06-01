import { configureStore } from '@reduxjs/toolkit';
import { currentProjectSlice } from '../redux/slices/currentProject';
import { currentTestingSlice } from './slices/currentTesting';
import { localServersSlice } from './slices/localServers';
import { projectsSlice } from './slices/projectsSlice';
import { renderTreesSlice } from './slices/renderTreesSlice';
import { testsSlice } from './slices/testsSlice';
import { shellTasksSlice } from './slices/shellTasksSlice';
import { shellLogsSlice } from './slices/shellLogsSlice';

export const store = configureStore({
  devTools: true,
  preloadedState: {
    // currentProject: currentProjectSlice.getInitialState(),
    // currentTesting: currentTestingSlice.getInitialState(),
    // localServers: localServersSlice.getInitialState(),
    projects: projectsSlice.getInitialState(),
    tests: testsSlice.getInitialState(),
    renderTrees: renderTreesSlice.getInitialState(),
    shellTasks: shellTasksSlice.getInitialState(),
    shellLogs: shellLogsSlice.getInitialState(),
  },
  reducer: {
    // currentProject: currentProjectSlice.reducer,
    // currentTesting: currentTestingSlice.reducer,
    // localServers: localServersSlice.reducer,
    projects: projectsSlice.reducer,
    tests: testsSlice.reducer,
    renderTrees: renderTreesSlice.reducer,
    shellTasks: shellTasksSlice.reducer,
    shellLogs: shellLogsSlice.reducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
