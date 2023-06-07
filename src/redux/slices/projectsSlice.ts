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
  parentProjectUid?: string;
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
      let newState: ReduxProjectsState = {
        ...state,
        projects: [
          // remove 1 item
          ...state.projects.slice(0, foundIndex),
          ...state.projects.slice(foundIndex + 1),
        ],
      };
      newState = {
        ...newState,
        openedProjectUid: newState.projects[foundIndex]?.projectUid ?? newState.projects[0]?.projectUid ?? '',
      };
      console.log('newState', foundIndex, newState);
      // if (newState.openedProjectUid === action.payload) {
      //   if (foundIndex === 0) {
      //     const newProjectUid = newState.projects[1]?.projectUid ?? '';
      //     newState = {
      //       ...newState,
      //       openedProjectUid: newProjectUid,
      //     };
      //   } else {
      //     const newProjectUid = newState.projects[foundIndex - 1].projectUid;
      //     newState = {
      //       ...newState,
      //       openedProjectUid: newProjectUid,
      //     };
      //   }
      // }
      // newState.projects.splice(foundIndex, 1);
      return newState;
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
  if (!currentProject && state.projects.projects.length > 0) {
    console.log(
      '[projectsSlice.selectors.selectCurrentProject] No current project. This should be fixed!',
      state.projects.openedProjectUid,
      state.projects.projects,
    );
    return state.projects.projects[0];
  }
  return currentProject;
};

export const selectCurrentProjectParent = () => (state: RootState): ReduxProject | undefined => {
  const currentProject = selectCurrentProject()(state);
  if (!currentProject) {
    return undefined;
  }
  if (!currentProject.parentProjectUid) {
    return undefined;
  }
  const parentProject = state.projects.projects.find(project => project.projectUid === currentProject.parentProjectUid);
  return parentProject;
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

export const selectRootProjects = () => (state: RootState): ReduxProject[] => {
  return state.projects.projects.filter(project => !project.parentProjectUid);
};

// --- thunks

const _openProjectFromRustThunk = (projectFromRust: ProjectFromRust, parentProjectUid?: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const projectUid = projectFromRust.project_dir;
  const projectDir = projectFromRust.project_dir;
  const displayName = projectFromRust.project_dir.split('/').pop() ?? projectFromRust.project_dir;
  const codeLanguage = projectFromRust.code_language;
  const framework = projectFromRust.framework;
  const dependencies: ReduxProjectDependency = {
    isInstalled: projectFromRust.dependencies_installed,
    errorMessage: '',
    isLoading: false,
  };
  const localServerCommands = projectFromRust.local_server_commands;
  const projectExists = getState().projects.projects.find(project => project.projectUid === projectUid);
  if (projectExists) {
  } else {
    await dispatch(projectsSlice.actions.addProject({
      parentProjectUid,
      projectUid,
      projectDir,
      displayName,
      codeLanguage,
      framework,
      dependencies,
      localServerCommands,
      subprojects: projectFromRust.subprojects,
    }));
    await fetchTestsFromProjectThunk(projectUid)(dispatch, getState);
  }
  await dispatch(projectsSlice.actions.setOpenedProjectUid(projectUid));
};

export const openProjectThunk = (projectFromRust?: ProjectFromRust) => async (dispatch: Dispatch, getState: () => RootState) => {
  addNotificationThunk(ReduxNotificationType.info, 'Opening project...')(dispatch, getState);
  projectFromRust = projectFromRust ?? await rustOpenProject();
  await _openProjectFromRustThunk(projectFromRust)(dispatch, getState);
};

export const openSubprojectThunk = (projectUid: string, subprojectPath: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const projectFromRust = await rustOpenProject(subprojectPath);
  await _openProjectFromRustThunk(projectFromRust, projectUid)(dispatch, getState);
};

export const closeProjectThunk = (projectUid: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  // todo: remove other resources (logs, shellTasks, renderTrees)
  await dispatch(projectsSlice.actions.removeProject(projectUid));
  const subprojects = selectProjects()(getState()).filter(project => project.parentProjectUid === projectUid);
  for (const subproject of subprojects) {
    await dispatch(projectsSlice.actions.removeProject(subproject.projectUid));
  }
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
