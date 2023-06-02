import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ProjectFromRust, SubprojectFromRust, rustInstallDependencies, rustOpenProject } from "../../services/rust";
import { ReduxNotificationType, addNotificationThunk } from "./notificationsSlice";
import { fetchTestsFromProjectThunk } from "./testsSlice";

interface ReduxProjectDependency {
  isInstalled: boolean | undefined;
  isLoading: boolean;
  errorMessage: string;
}

export type ReduxSubproject = SubprojectFromRust;

export interface ReduxProject {
  projectUid: string;
  projectDir: string;
  displayName: string;
  codeLanguage: string;
  framework: string;
  dependencies: ReduxProjectDependency;
  localServerCommands: string[];
  subprojects: ReduxSubproject[];
}

interface ReduxProjectsState {
  openedProjectUid: string;
  projects: ReduxProject[];
}

// --- initial state

const initialState: ReduxProjectsState = {
  openedProjectUid: '',
  projects: [],
};

// --- slice

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setOpenedProjectUid: (state: ReduxProjectsState, action: PayloadAction<string>): ReduxProjectsState => {
      return {
        ...state,
        openedProjectUid: action.payload,
      };
    },
    addProject: (state: ReduxProjectsState, action: PayloadAction<ReduxProject>): ReduxProjectsState => {
      const foundIndex = state.projects.findIndex(project => project.projectUid === action.payload.projectUid);
      if (foundIndex > 0) {
        throw new Error(`[projectsSlice.reducers.addProject] Project already exists: ${action.payload.projectUid}`);
      }
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    },
    removeProject: (state: ReduxProjectsState, action: PayloadAction<string>): ReduxProjectsState => {
      const foundIndex = state.projects.findIndex(project => project.projectUid === action.payload);
      if (foundIndex === -1) {
        throw new Error(`[projectsSlice.reducers.removeProject] Project not found: ${action.payload}`);
      }
      const newState = { ...state };
      // newState.projects.splice(foundIndex, 1);
      // return newState;
      return {
        ...newState,
        projects: [
          // remove 1 item
          ...newState.projects.slice(0, foundIndex),
          ...newState.projects.slice(foundIndex + 1),
        ],
      };
    },
    setDependenciesLoading: (state: ReduxProjectsState, action: PayloadAction<{ projectUid: string }>): ReduxProjectsState => {
      const foundIndex = state.projects.findIndex(project => project.projectUid === action.payload.projectUid);
      if (foundIndex === -1) {
        throw new Error(`[projectsSlice.reducers.setDependenciesLoading] Project not found: ${action.payload.projectUid}`);
      }
      const newState = { ...state };
      // newState.projects[foundIndex].dependencies.isLoading = true;
      // newState.projects[foundIndex].dependencies.isInstalled = false;
      // newState.projects[foundIndex].dependencies.errorMessage = '';
      // return newState;
      return {
        ...newState,
        projects: [
          ...newState.projects.slice(0, foundIndex),
          {
            ...newState.projects[foundIndex],
            dependencies: {
              ...newState.projects[foundIndex].dependencies,
              isLoading: true,
              isInstalled: false,
              errorMessage: '',
            },
          },
          ...newState.projects.slice(foundIndex + 1),
        ],
      };
    },
    setDependenciesInstalled: (state: ReduxProjectsState, action: PayloadAction<{ projectUid: string }>): ReduxProjectsState => {
      const foundIndex = state.projects.findIndex(project => project.projectUid === action.payload.projectUid);
      if (foundIndex === -1) {
        throw new Error(`[projectsSlice.reducers.setDependenciesInstalled] Project not found: ${action.payload.projectUid}`);
      }
      const newState = { ...state };
      newState.projects[foundIndex].dependencies.isLoading = false;
      newState.projects[foundIndex].dependencies.isInstalled = true;
      newState.projects[foundIndex].dependencies.errorMessage = '';
      return newState;
    },
    setDependenciesErrorMessage: (state: ReduxProjectsState, action: PayloadAction<{ projectUid: string, errorMessage: string }>): ReduxProjectsState => {
      const foundIndex = state.projects.findIndex(project => project.projectUid === action.payload.projectUid);
      if (foundIndex === -1) {
        throw new Error(`[projectsSlice.reducers.setDependenciesErrorMessage] Project not found: ${action.payload.projectUid}`);
      }
      const newState = { ...state };
      newState.projects[foundIndex].dependencies.isLoading = false;
      newState.projects[foundIndex].dependencies.isInstalled = false;
      newState.projects[foundIndex].dependencies.errorMessage = action.payload.errorMessage;
      return newState;
    },
  },
});

// --- selectors

export const selectCurrentProject = () => (state: RootState): ReduxProject | undefined => {
  const currentProject = state.projects.projects.find(project => project.projectUid === state.projects.openedProjectUid);
  return currentProject;
};

export const selectCurrentProjectDir = () => (state: RootState): string => selectCurrentProject()(state)?.projectDir ?? '';

export const selectProjectDir = (projectUid: string) => (state: RootState): string => {
  const project = state.projects.projects.find(project => project.projectUid === projectUid);
  if (!project) {
    return '';
  }
  return project.projectDir;
};

export const selectProjects = () => (state: RootState): ReduxProject[] => {
  return state.projects.projects;
};

// --- thunks

export const openProjectThunk = (project?: ProjectFromRust) => async (dispatch: Dispatch, getState: () => RootState) => {
  addNotificationThunk(ReduxNotificationType.info, 'Opening project...')(dispatch, getState);
  project = project ?? await rustOpenProject();
  const projectUid = project.project_dir;
  const projectDir = project.project_dir;
  const displayName = project.project_dir.split('/').pop() ?? project.project_dir;
  const codeLanguage = project.code_language;
  const framework = project.framework;
  const dependencies: ReduxProjectDependency = {
    isInstalled: project.dependencies_installed,
    errorMessage: '',
    isLoading: false,
  };
  const localServerCommands = project.local_server_commands;
  await dispatch(projectsSlice.actions.addProject({
    projectUid,
    projectDir,
    displayName,
    codeLanguage,
    framework,
    dependencies,
    localServerCommands,
    subprojects: project.subprojects,
  }));
  await dispatch(projectsSlice.actions.setOpenedProjectUid(projectUid));
  await fetchTestsFromProjectThunk(projectUid)(dispatch, getState);
};

export const closeProjectThunk = (projectUid: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  // todo: remove other resources (logs, shellTasks, renderTrees)
  await dispatch(projectsSlice.actions.removeProject(projectUid));
};

export const closeCurrentProjectThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
  const currentProject = selectCurrentProject()(getState());
  if (!currentProject) {
    throw new Error('[projectsSlice.thunks.closeCurrentProjectThunk] No current project');
  }
  await closeProjectThunk(currentProject.projectUid)(dispatch, getState);
};

export const installDependenciesThunk = (projectUid: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(projectsSlice.actions.setDependenciesLoading({ projectUid }));
    const projectDir = selectCurrentProjectDir()(getState());
    if (projectDir === '') {
      throw new Error('[projectsSlice.thunks.installDependenciesThunk] No current project');
    }
    await rustInstallDependencies(projectDir);
    await dispatch(projectsSlice.actions.setDependenciesInstalled({ projectUid }));
  } catch (e) {
    await dispatch(projectsSlice.actions.setDependenciesErrorMessage({ projectUid, errorMessage: String(e) }));
  }
};

// --- actions

export const {
  setOpenedProjectUid,
} = projectsSlice.actions;
