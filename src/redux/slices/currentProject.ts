import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { OptionalRenderTree, ProjectFromRust, rustGetFileTree, rustInstallDependencies, rustOpenProject } from '../../services/rust';
import { closeCurrentTesting, fetchCurrentTestingScriptsThunk } from './currentTesting';
import { addLocalServerCommandsThunk } from './localServers';

// --- initial state

interface EditorProject {
  id: string;
  projectDir: string;
  displayName: string;
  codeLanguage: string;
  framework: string;
  renderTree: OptionalRenderTree;
  localServerCommands: string[];
  dependencies: {
    isInstalled: boolean | undefined;
    isLoading: boolean;
    errorMessage: string;
  };
  isLoading: boolean;
}

export type EditorTab = EditorProject;

interface EditorNotification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info' | 'loading';
}

export interface EditorState {
  currentTabId: string;
  notifications: EditorNotification[];
  tabs: EditorProject[];
}

const initialState: EditorState = {
  currentTabId: '',
  notifications: [],
  tabs: [],
  // projectDir: '',
  // displayName: '',
  // errorMessage: '',
  // codeLanguage: '',
  // framework: '',
  // renderTree: undefined,
  // dependencies: {
  //   isInstalled: undefined,
  //   isLoading: false,
  //   errorMessage: '',
  // },
  // isLoading: false,
};
// const initialState: CurrentProjectState = {
//   projectDir: '/home/l/dasa/sigo/v2',
//   displayName: 'v2',
//   errorMessage: '',
//   renderTree: undefined,
//   isLoading: false,
// };

// --- slice

export const currentProjectSlice = createSlice({
  name: 'currentProject',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | Error>): EditorState => {
      const errorMessage: string = action.payload instanceof Error ? action.payload.message : action.payload;
      const tabs: EditorProject[] = state.tabs.map((tab, index) => {
        if (tab.id === state.currentTabId) {
          return {
            ...state.tabs[index],
            currentTabId: '0',
            tabs,
            errorMessage,
            isSuccess: false,
            isLoading: false,
          };
        }
        return tab;
      });
      return {
        ...state,
        tabs,
      };
    },
    setLoading: (state, action: PayloadAction<undefined>): EditorState => {
      const tabs: EditorProject[] = state.tabs.map((tab, index) => {
        if (tab.id === state.currentTabId) {
          return {
            ...state.tabs[index],
            isLoading: true,
            errorMessage: '',
          };
        }
        return tab;
      });
      return {
        ...state,
        tabs,
      };
    },
    addNotification: (state, action: PayloadAction<EditorNotification>): EditorState => {
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    },
    // replaceNotification: (state, action: PayloadAction<EditorNotification>): EditorState => {
    //   const notifications = state.notifications.map((notification) => {
    //     if (notification.id === action.payload.id) {
    //       return action.payload;
    //     }
    //     return notification;
    //   });
    //   return {
    //     ...state,
    //     notifications,
    //   };
    // },
    removeNotification: (state, action: PayloadAction<string>): EditorState => {
      const notifications = state.notifications.filter((notification) => notification.id !== action.payload);
      return {
        ...state,
        notifications,
      };
    },
    setProjectFromRust: (state, action: PayloadAction<ProjectFromRust>): EditorState => {
      // return {
      //   ...state,
      //   projectDir: action.payload.project_dir,
      //   codeLanguage: action.payload.code_language,
      //   framework: action.payload.framework,
      //   dependencies: {
      //     isInstalled: action.payload.dependencies_installed,
      //     isLoading: false,
      //     errorMessage: '',
      //   },
      // };
      let foundIndex = -1;
      for (const [index, tab] of state.tabs.entries()) {
        // todo: change projectDir to id
        if (tab.projectDir === action.payload.project_dir) {
          foundIndex = index;
          break;
        }
      }
      let currentTabId = state.currentTabId;
      let tabs: EditorProject[] = [...state.tabs];
      if (foundIndex !== -1) {
        tabs[foundIndex] = {
          ...tabs[foundIndex],
          ...action.payload,
        };
      } else {
        const newTab: EditorProject = {
          id: String(Math.random()),
          projectDir: action.payload.project_dir,
          displayName: action.payload.project_dir.split('/').pop() ?? action.payload.project_dir,
          codeLanguage: action.payload.code_language,
          framework: action.payload.framework,
          renderTree: undefined,
          localServerCommands: action.payload.local_server_commands,
          dependencies: {
            isInstalled: action.payload.dependencies_installed,
            isLoading: false,
            errorMessage: '',
          },
          isLoading: false,
        };
        currentTabId = newTab.id;
        tabs = [...tabs, newTab];
      }
      return {
        ...state,
        tabs,
        currentTabId,
      };
    },
    // deleteme
    // setProjectDir: (state, action: PayloadAction<string>): EditorState => {
    //   return {
    //     ...state,
    //     projectDir: action.payload,
    //   };
    // },
    setRenderTree: (state, action: PayloadAction<OptionalRenderTree>): EditorState => {
      const currentProjectIndex = state.tabs.findIndex((tab) => tab.id === state.currentTabId);
      if (currentProjectIndex === -1) {
        return state;
      }
      const tabs: EditorProject[] = [...state.tabs];
      tabs[currentProjectIndex] = {
        ...tabs[currentProjectIndex],
        renderTree: action.payload,
        displayName: action.payload?.name ?? '',
        isLoading: false,
      };
      return {
        ...state,
        tabs,
      };
    },
    closeCurrentProject: (state, action: PayloadAction<undefined>): EditorState => {
      const currentProjectIndex = state.tabs.findIndex((tab) => tab.id === state.currentTabId);
      if (currentProjectIndex === -1) {
        return state;
      }
      const tabs: EditorProject[] = [...state.tabs];
      tabs.splice(currentProjectIndex, 1);
      return {
        ...state,
        tabs,
        currentTabId: tabs.length > 0 ? tabs[0].id : '',
      };
    },
    closeProjectByTabId: (state, action: PayloadAction<string>): EditorState => {
      const projectIndex = state.tabs.findIndex((tab) => tab.id === action.payload);
      if (projectIndex === -1) {
        return state;
      }
      const tabs: EditorProject[] = [...state.tabs];
      tabs.splice(projectIndex, 1);
      return {
        ...state,
        tabs,
        currentTabId: tabs.length > 0 ? tabs[0].id : '',
      };
    },
    setDependenciesLoading: (state, action: PayloadAction<undefined>): EditorState => {
      const currentProjectIndex = state.tabs.findIndex((tab) => tab.id === state.currentTabId);
      if (currentProjectIndex === -1) {
        return state;
      }
      const tabs: EditorProject[] = [...state.tabs];
      tabs[currentProjectIndex] = {
        ...tabs[currentProjectIndex],
        dependencies: {
          ...tabs[currentProjectIndex].dependencies,
          isInstalled: undefined,
          isLoading: true,
          errorMessage: '',
        },
      };
      return {
        ...state,
        tabs,
      };
    },
    setDependenciesInstalled: (state, action: PayloadAction<boolean>): EditorState => {
      const currentProjectIndex = state.tabs.findIndex((tab) => tab.id === state.currentTabId);
      if (currentProjectIndex === -1) {
        return state;
      }
      const tabs: EditorProject[] = [...state.tabs];
      tabs[currentProjectIndex] = {
        ...tabs[currentProjectIndex],
        dependencies: {
          ...tabs[currentProjectIndex].dependencies,
          isInstalled: action.payload,
          isLoading: true,
          errorMessage: '',
        },
      };
      return {
        ...state,
        tabs,
      };
    },
    setDependenciesErrorMessage: (state, action: PayloadAction<string>): EditorState => {
      const currentProjectIndex = state.tabs.findIndex((tab) => tab.id === state.currentTabId);
      if (currentProjectIndex === -1) {
        return state;
      }
      const tabs: EditorProject[] = [...state.tabs];
      tabs[currentProjectIndex] = {
        ...tabs[currentProjectIndex],
        dependencies: {
          ...tabs[currentProjectIndex].dependencies,
          isInstalled: false,
          isLoading: false,
          errorMessage: action.payload,
        },
      };
      return {
        ...state,
        tabs,
      };
    },
    setCurrentTabId: (state, action: PayloadAction<string>): EditorState => {
      return {
        ...state,
        currentTabId: action.payload,
      };
    },
  },
});

// --- selectors

export const selectEditorTabs = (state: RootState): EditorProject[] => state.currentProject.tabs;

export const selectCurrentProject = (state: RootState): EditorProject | undefined => {
  return state.currentProject.tabs.find((tab) => tab.id === state.currentProject.currentTabId);
};

export const selectProjectDir = (state: RootState): string => selectCurrentProject(state)?.projectDir ?? '';
// export const selectRenderTree = (state: RootState): RenderTree | undefined => state.currentProject.renderTree;

export const selectCurrentProjectLocalServerCommands = (state: RootState): string[] => {
  const project = selectCurrentProject(state);
  if (!project) {
    return [];
  }
  return project.localServerCommands;
}

// --- actions

export const { setRenderTree, setError, setLoading } = currentProjectSlice.actions;

// --- thunks

export const addNotificationThunk = (notification: EditorNotification, time = 5000) => async (dispatch: Dispatch, getState: () => RootState) => {
  const id = String(Math.random());
  dispatch(currentProjectSlice.actions.addNotification({ ...notification, id }));
  setTimeout(() => {
    dispatch(currentProjectSlice.actions.removeNotification(id));
  }, time);
};

export const openProjectThunk = (project?: ProjectFromRust) => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    addNotificationThunk({
      id: 'open-project',
      message: 'Opening project...',
      type: 'loading',
    })(dispatch, getState);
    const projectFromRust = project ?? await rustOpenProject();
    dispatch(currentProjectSlice.actions.setProjectFromRust(projectFromRust));
    // const tree = await rustGetFileTree(projectFromRust.project_dir);
    // dispatch(setRenderTree(tree));
    closeCurrentTesting()(dispatch, getState);
    loadRenderTreeThunk()(dispatch, getState);
    fetchCurrentTestingScriptsThunk()(dispatch, getState);
    addLocalServerCommandsThunk(projectFromRust.local_server_commands)(dispatch, getState);
  } catch (e) {
    dispatch(setError(e as Error));
  }
};

export const setCurrentTabIdThunk = (tabId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch(currentProjectSlice.actions.setCurrentTabId(tabId));
  closeCurrentTesting()(dispatch, getState);
  loadRenderTreeThunk()(dispatch, getState);
  fetchCurrentTestingScriptsThunk()(dispatch, getState);
  const currentProject = selectCurrentProject(getState())!;
  addLocalServerCommandsThunk(currentProject.localServerCommands)(dispatch, getState);
};

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

export const closeCurrentProjectThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch(currentProjectSlice.actions.closeCurrentProject());
  closeCurrentTesting()(dispatch, getState);
};

export const closeProjectByTabIdThunk = (tabId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const state = getState();
  // get project by tabId
  const project: EditorProject | undefined = selectEditorTabs(state).find((tab) => tab.id === tabId);
  if (!project) {
    throw new Error(`closeProjectByTabIdThunk - tabId not found: ${tabId}`);
  }
  // close current tab
  // const currentTabId: string = state.currentProject.currentTabId;
  // const isCurrent = currentTabId === tabId;
  // await dispatch(currentProjectSlice.actions.closeProjectByTabId(tabId));
  // if (isCurrent) {
  //   await closeCurrentTesting()(dispatch, getState);
  // }
  // set next tab
  const newTabs = selectEditorTabs(getState());
  if (newTabs.length === 0) {
    return;
  }
  setCurrentTabIdThunk(newTabs[0].id)(dispatch, getState);
}

export const installDependenciesThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(currentProjectSlice.actions.setDependenciesLoading());
    const projectDir = selectProjectDir(getState());
    await rustInstallDependencies(projectDir);
    await dispatch(currentProjectSlice.actions.setDependenciesInstalled(true));
  } catch (e) {
    await dispatch(currentProjectSlice.actions.setDependenciesErrorMessage(String(e)));
  }
};

// --- reducer

export default currentProjectSlice.reducer;
