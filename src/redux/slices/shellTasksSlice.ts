import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ReduxShellLog, addShellLog } from "./shellLogsSlice";
import { shellKill, shellSpawn } from "../../services/shell";
import { selectCurrentProjectDir } from "./projectsSlice";
import { rustRunShellCommand } from "../../services/rust";
import { invoke } from "@tauri-apps/api";

export interface ReduxShellTask {
  shellTaskUid: string;
  projectUid: string;
  command: string;
  pid?: number;
  isRunning: boolean;
}

type ReduxShellTasksState = ReduxShellTask[];

const initialState: ReduxShellTasksState = [];

// --- slice

export const shellTasksSlice = createSlice({
  name: 'shellTasks',
  initialState,
  reducers: {
    addShellTask: (state: ReduxShellTasksState, action: PayloadAction<ReduxShellTask>): ReduxShellTasksState => {
      const newState = [...state];
      const foundIndex = newState.findIndex(shellTask => shellTask.shellTaskUid === action.payload.shellTaskUid);
      if (foundIndex > -1) {
        throw new Error(`[shellTasksSlice.reducers.addShellTask] Shell task already exists: ${action.payload.shellTaskUid}`);
      }
      newState.push(action.payload);
      return newState;
    },
    removeShellTask: (state: ReduxShellTasksState, action: PayloadAction<string>): ReduxShellTasksState => {
      const newState = [...state];
      const foundIndex = newState.findIndex(shellTask => shellTask.shellTaskUid === action.payload);
      if (foundIndex === -1) {
        throw new Error(`[shellTasksSlice.reducers.removeShellTask] Shell task not found: ${action.payload}`);
      }
      newState.splice(foundIndex, 1);
      return newState;
    },
    startShellTask: (state: ReduxShellTasksState, action: PayloadAction<string>): ReduxShellTasksState => {
      const newState = [...state];
      const foundIndex = newState.findIndex(shellTask => shellTask.shellTaskUid === action.payload);
      if (foundIndex === -1) {
        throw new Error(`[shellTasksSlice.reducers.startShellTask] Shell task not found: ${action.payload}`);
      }
      return newState;
    },
    stopShellTask: (state: ReduxShellTasksState, action: PayloadAction<string>): ReduxShellTasksState => {
      const newState = [...state];
      const foundIndex = newState.findIndex(shellTask => shellTask.shellTaskUid === action.payload);
      if (foundIndex === -1) {
        throw new Error(`[shellTasksSlice.reducers.stopShellTask] Shell task not found: ${action.payload}`);
      }
      return newState;
    },
    setShellTaskPid: (state: ReduxShellTasksState, action: PayloadAction<{ shellTaskUid: string; pid: number }>): ReduxShellTasksState => {
      const newState = [...state];
      const foundIndex = newState.findIndex(shellTask => shellTask.shellTaskUid === action.payload.shellTaskUid);
      if (foundIndex === -1) {
        throw new Error(`[shellTasksSlice.reducers.setShellTaskPid] Shell task not found: ${action.payload.shellTaskUid}`);
      }
      // newState[foundIndex].pid = action.payload.pid;
      // return newState;
      return [
        ...newState.slice(0, foundIndex),
        {
          ...newState[foundIndex],
          pid: action.payload.pid,
          isRunning: true,
        },
        ...newState.slice(foundIndex + 1),
      ];
    },
  },
});

// --- selectors

export const selectShellTasksByProject = (projectUid: string) => (state: { shellTasks: ReduxShellTasksState }): ReduxShellTasksState => {
  return state.shellTasks.filter(shellTask => shellTask.projectUid === projectUid);
};

export const selectShellTask = (shellTaskUid: string) => (state: { shellTasks: ReduxShellTasksState }): ReduxShellTask | undefined => {
  return state.shellTasks.find(shellTask => shellTask.shellTaskUid === shellTaskUid);
};

// --- thunks

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const addShellTaskThunk = (shellTask: ReduxShellTask) => async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  dispatch(shellTasksSlice.actions.addShellTask(shellTask));
  const logHandler = (name: string) => async (data: any) => {
    const log: ReduxShellLog = {
      shellTaskUid: shellTask.shellTaskUid,
      message: String(data),
      timestamp: Date.now(),
      type: name === 'stderr' ? 'error' : 'normal',
    };
    await dispatch(addShellLog(log));
  };
  const cwd = selectCurrentProjectDir()(getState());
  const pid = await shellSpawn({
    key: shellTask.shellTaskUid,
    command: shellTask.command,
    cwd,
    onStdout: logHandler('stdout'),
    onStderr: logHandler('stderr'),
    onError: logHandler('error'),
    onExit: logHandler('exit'),
  });
  // await child.kill();
  alert(`pid is ${pid}`);
  await dispatch(shellTasksSlice.actions.setShellTaskPid({ shellTaskUid: shellTask.shellTaskUid, pid }));
  // await delay(5000);
  // console.log('----- 1', pid);
  // const res = await rustRunShellCommand(cwd, `kill -INT ${pid}`);
  // console.log('----- 2 ', res);
  // await shellKill(pid);
  // await child.kill();
};

export const removeShellTaskThunk = (shellTaskUid: string) => async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  const shellTask = selectShellTask(shellTaskUid)(getState());
  if (!shellTask) {
    throw new Error(`[removeShellTaskThunk] Shell task not found: ${shellTaskUid}`);
  }
  if (shellTask.pid) {
    await shellKill(shellTask.pid);
  }
  await dispatch(shellTasksSlice.actions.removeShellTask(shellTaskUid));
};
