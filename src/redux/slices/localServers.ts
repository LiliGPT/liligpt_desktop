import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { shell } from '@tauri-apps/api';
import { selectProjectDir } from './currentProject';
import { shellKill, shellSpawn } from '../../services/shell';

// --- initial state

export interface LocalServerLogBlock {
  projectKey: string;
  localServerId: string;
  timestamp: number;
  message: string;
  type: 'normal' | 'internal' | 'error';
}

export interface LocalServer {
  localServerId: string;
  command: string;
  logs: LocalServerLogBlock[];
  isRunning: boolean;
  // port: number;
  // isStarting: boolean;
  // isStopping: boolean;
}

interface LocalServersState {
  openedProjectKey: string;
  projectServers: {
    [projectKey: string]: LocalServer[];
  };
  logs: LocalServerLogBlock[];
}

const initialState: LocalServersState = {
  openedProjectKey: '',
  projectServers: {},
  logs: [],
}

// --- slice

export const localServersSlice = createSlice({
  name: 'localServer',
  initialState,
  reducers: {
    setOpenedProjectServer: (state, action: PayloadAction<string>): LocalServersState => {
      state.openedProjectKey = action.payload;
      return state;
    },
    setLocalServer: (state, action: PayloadAction<{
      projectKey: string;
      localServerId: string;
    }>): LocalServersState => {
      const projectServers: LocalServer[] = state.projectServers[action.payload.projectKey] ?? [];
      const exists: boolean = projectServers.some(server => server.localServerId === action.payload.localServerId);
      if (!exists) {
        projectServers.push({
          localServerId: action.payload.localServerId,
          command: action.payload.localServerId,
          logs: [],
          isRunning: false,
        });
      }

      // ---
      const servers = [...state.servers];
      if (serverIndex === -1) {
        servers.push(action.payload);
      } else {
        servers[serverIndex] = action.payload;
      }
      return {
        ...state,
        servers,
      };
    },
    stopLocalServer: (state, action: PayloadAction<LocalServerIdentification>) => {
      const serverIndex = state.servers.findIndex(server => server.localServerId === action.payload.localServerId && server.projectKey === action.payload.projectKey);
      if (serverIndex === -1) {
        throw new Error(`Server ${action.payload} not found`);
      }
      const servers = [...state.servers];
      servers[serverIndex] = {
        ...servers[serverIndex],
        isRunning: false,
      };
      return {
        ...state,
        servers,
      };
    },
    removeServerByName: (state, action: PayloadAction<LocalServerIdentification>) => {
      state.servers = state.servers.filter(server => server.localServerId !== action.payload.localServerId && server.projectKey !== action.payload.projectKey);
    },
    addLogToLocalServer: (state, action: PayloadAction<LocalServerLogBlock>) => {
      const serverIndex = state.servers.findIndex(server => server.localServerId === action.payload.localServerId && server.projectKey === action.payload.projectKey);
      if (serverIndex === -1) {
        throw new Error(`Local server not found: ${action.payload.projectKey} ${action.payload.localServerId}`);
      }
      const servers = [...state.servers];
      servers[serverIndex] = {
        ...servers[serverIndex],
        logs: [...servers[serverIndex].logs, action.payload],
      };
      return {
        ...state,
        servers,
      };
    },
  },
});

// --- selectors

export const selectLocalServers = (state: RootState): LocalServer[] => state.localServers.servers;

export const selectOpenedLocalServer = (state: RootState): LocalServer | undefined => {
  return state.localServers.servers.find(server => server.localServerId === state.localServers.openedProjectKey);
};

// --- actions

export const {
  addLogToLocalServer,
} = localServersSlice.actions;

// --- thunks

export const addLocalServerCommandsThunk = (projectKey: string, commands: string[]) => async (dispatch: Dispatch, getState: () => RootState) => {
  for (const command of commands) {
    const server: LocalServer = {
      projectKey,
      localServerId: command,
      command: command,
      logs: [],
      isRunning: false,
    };
    await dispatch(localServersSlice.actions.setLocalServer(server));
  }
}

let _logIds = 0;

export const runLocalServerCommandThunk = (projectKey: string, command: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  console.log('[runLocalServerThunk] starting');
  const localServers = selectLocalServers(getState());
  const localCommands = localServers.find(server => server.projectKey === projectKey);
  if (!server) {
    throw new Error(`Project not found: ${projectKey}`);
  }
  if (server.isRunning) {
    throw new Error(`Server is already running: ${server.localServerId}`);
  } else {
    console.log('[runLocalServerThunk] preparing to run server');
  }
  dispatch(localServersSlice.actions.setLocalServer({
    ...server,
    isRunning: true,
  }));
  // todo: refactor logHandler
  // ---
  const logHandler = (name: string) => (data: any) => {
    const log: LocalServerLogBlock = {
      // id: Date.now(),
      localServerId: server.localServerId,
      projectKey: server.projectKey,
      timestamp: new Date().toISOString(),
      message: `${name} | ${data}`,
      type: 'normal',
    };
    dispatch(localServersSlice.actions.addLogToLocalServer(log));
  };
  const cwd = getState().currentProject.tabs.find(tab => tab.id === projectKey)!.projectDir;
  shellSpawn({
    key: `${Date.now()}`, // todo: unique key
    command: server.command,
    cwd,
    onStdout: logHandler('stdout'),
    onStderr: () => logHandler('stderr'),
    onError: logHandler('error'),
    onExit: logHandler('exit'),
  });
  // ---
}

export const openLocalServerThunk = (serverName: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const servers = selectLocalServers(getState());
  const server = servers.find(server => server.localServerId === serverName);
  if (!server) {
    throw new Error(`Server ${serverName} not found`);
  }
  if (!server.isRunning) {
    throw new Error(`Server ${serverName} is not running`);
  }
  dispatch(localServersSlice.actions.setOpenedProjectServer(serverName));
}

export const stopLocalServerThunk = (serverName: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const server = selectOpenedLocalServer(getState());
  if (!server) {
    alert(`Server does not exists: ${serverName}`);
    throw new Error(`Server ${serverName} not found`);
  }
  // if (!server.isRunning) {
  //   alert(`Server is not running: ${serverName}`);
  //   throw new Error(`Server ${serverName} is not running`);
  // }
  // kill in port 3000
  // todo: customize port
  // console.log((await new shell.Command('bash', [`kill $(lsof -t -i:3000)`], {
  //   cwd: selectProjectDir(getState()),
  //   encoding: 'utf-8',
  // }).execute()).stdout);
  // ---
  // alert('going to kill');
  await shellKill
}

// --- reducer

export default localServersSlice.reducer;
