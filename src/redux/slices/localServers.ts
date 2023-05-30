import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { shell } from '@tauri-apps/api';
import { selectProjectDir } from './currentProject';

// --- initial state

export interface LocalServerLogBlock {
  id: number;
  timestamp: string;
  message: string;
  type: 'normal' | 'internal' | 'error';
}

export interface LocalServer {
  name: string;
  value: string;
  logs: LocalServerLogBlock[];
  isRunning: boolean;
  // port: number;
  // isStarting: boolean;
  // isStopping: boolean;
}

interface LocalServersState {
  openedServerName: string;
  servers: LocalServer[];
}

const initialState: LocalServersState = {
  openedServerName: '',
  servers: [],
}

// --- slice

export const localServersSlice = createSlice({
  name: 'localServer',
  initialState,
  reducers: {
    openLocalServer: (state, action: PayloadAction<string>) => {
      state.openedServerName = action.payload;
    },
    setLocalServer: (state, action: PayloadAction<LocalServer>) => {
      let serverIndex = state.servers.findIndex(server => server.name === action.payload.name);
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
    stopLocalServer: (state, action: PayloadAction<string>) => {
      const serverIndex = state.servers.findIndex(server => server.name === action.payload);
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
    removeServerByName: (state, action: PayloadAction<string>) => {
      state.servers = state.servers.filter(server => server.name !== action.payload);
    },
    addLogToLocalServer: (state, action: PayloadAction<{ serverName: string, log: LocalServerLogBlock }>) => {
      const serverIndex = state.servers.findIndex(server => server.name === action.payload.serverName);
      if (serverIndex === -1) {
        throw new Error(`Server ${action.payload.serverName} not found`);
      }
      const servers = [...state.servers];
      servers[serverIndex] = {
        ...servers[serverIndex],
        logs: [...servers[serverIndex].logs, action.payload.log],
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
  return state.localServers.servers.find(server => server.name === state.localServers.openedServerName);
};

// --- actions

export const {
  addLogToLocalServer,
} = localServersSlice.actions;

// --- thunks

export const addLocalServerCommandsThunk = (commands: string[]) => async (dispatch: Dispatch, getState: () => RootState) => {
  for (const command of commands) {
    const server: LocalServer = {
      name: command,
      value: command,
      logs: [],
      isRunning: false,
    };
    await dispatch(localServersSlice.actions.setLocalServer(server));
  }
}

export const runLocalServerThunk = (serverName: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const servers = selectLocalServers(getState());
  const server = servers.find(server => server.name === serverName);
  if (!server) {
    throw new Error(`Server ${serverName} not found`);
  }
  if (server.isRunning) {
    throw new Error(`Server ${serverName} is already running`);
  }
  dispatch(localServersSlice.actions.setLocalServer({
    ...server,
    isRunning: true,
  }));
  // todo: exec server.value
  // ---
  const logHandler = (name: string) => (data: any) => {
    const log: LocalServerLogBlock = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message: `${name} | ${data}`,
      type: 'normal',
    };
    dispatch(localServersSlice.actions.addLogToLocalServer({
      serverName: server.name,
      log,
    }));
  };
  const cwd = selectProjectDir(getState());
  const stopShell = _runShell({
    command: server.value,
    cwd,
    onStdout: logHandler('stdout'),
    onStderr: () => logHandler('stderr'),
    onError: logHandler('error'),
    onExit: logHandler('exit'),
  });
  // ---
}

function _runShell(props: {
  command: string;
  cwd: string;
  onStdout: (data: string) => void;
  onStderr: (data: string) => void;
  onError: (err: Error) => void;
  onExit: (code: number) => void;
}): () => void {
  const cmd = new shell.Command('bash', ['-c', props.command], {
    cwd: props.cwd,
    encoding: 'utf-8',
  });
  cmd.stdout.on('data', props.onStdout);
  cmd.stderr.on('data', props.onStderr);
  cmd.on('error', props.onError);
  cmd.on('close', props.onExit);
  cmd.spawn();
  return () => cmd.removeAllListeners();
}

export const openLocalServerThunk = (serverName: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const servers = selectLocalServers(getState());
  const server = servers.find(server => server.name === serverName);
  if (!server) {
    throw new Error(`Server ${serverName} not found`);
  }
  if (!server.isRunning) {
    throw new Error(`Server ${serverName} is not running`);
  }
  dispatch(localServersSlice.actions.openLocalServer(serverName));
}

export const stopLocalServerThunk = (serverName: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const servers = selectLocalServers(getState());
  const server = servers.find(server => server.name === serverName);
  if (!server) {
    throw new Error(`Server ${serverName} not found`);
  }
  if (!server.isRunning) {
    throw new Error(`Server ${serverName} is not running`);
  }
  dispatch(localServersSlice.actions.stopLocalServer(serverName));
}

// --- reducer

export default localServersSlice.reducer;
