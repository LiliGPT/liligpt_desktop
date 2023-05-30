import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// --- initial state

interface LogBlock {
  id: number;
  timestamp: string;
  message: string;
  type: 'normal' | 'error';
}

export interface LocalServer {
  name: string;
  value: string;
  logs: LogBlock[];
  isRunning: boolean;
  // port: number;
  // isStarting: boolean;
  // isStopping: boolean;
}

interface LocalServersState {
  servers: LocalServer[];
}

const initialState: LocalServersState = {
  servers: [],
}

// --- slice

export const localServersSlice = createSlice({
  name: 'localServer',
  initialState,
  reducers: {
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
  },
});

// --- selectors

export const selectLocalServers = (state: RootState): LocalServer[] => state.localServers.servers;

// --- actions

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
  // todo: exec server.value
  dispatch(localServersSlice.actions.setLocalServer({
    ...server,
    isRunning: true,
  }));
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
