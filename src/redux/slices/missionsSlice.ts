import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { rustCreateMission, rustExecutionDelete, rustFetchMissions, rustPromptApproveAndRun, rustPromptSubmitReview, rustReplaceExecutionActions, rustRetryExecution, rustSearchExecutions } from "../../services/rust";
import { RootState } from "../store";
import { MissionAction, MissionExecution } from "../../services/rust/rust";
import { authRefreshTokenThunk } from "./authSlice";

// --- initial state

const initialState: ReduxMissionsState = {
  loading: false,
  errorMessage: '',
  executions: [],
};

interface ReduxMissionsState {
  loading: boolean;
  errorMessage: string;
  executions: MissionExecution[];
}

// --- slice

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setLoading: (state: ReduxMissionsState, action: PayloadAction<boolean>): ReduxMissionsState => {
      return {
        ...state,
        loading: action.payload,
        errorMessage: '',
      };
    },
    setErrorMessage: (state: ReduxMissionsState, action: PayloadAction<string>): ReduxMissionsState => {
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    },
    setExecutions: (state: ReduxMissionsState, action: PayloadAction<MissionExecution[]>): ReduxMissionsState => {
      return {
        ...state,
        loading: false,
        executions: action.payload,
      };
    },
  },
});

// --- selectors

export const selectExecutions = (state: RootState): MissionExecution[] => {
  return state.missions.executions;
};

// --- thunks

export const fetchExecutionsThunk = () => (dispatch: Dispatch, getState: () => RootState): Promise<MissionExecution[]> => {
  return new Promise(async (resolve, reject) => {
    // if (getState().missions.loading) {
    //   console.log(`[fetchExecutionsThunk] already loading`);
    //   resolve();
    //   return;
    // }
    await dispatch(missionsSlice.actions.setLoading(true));
    await authRefreshTokenThunk()(dispatch, getState);
    const request = {
      filter: {
        'execution_status': { '$ne': 'Fail' }
      }
    };
    rustSearchExecutions(request).then(async (executions: MissionExecution[]) => {
      console.log(`[fetchExecutionsThunk]`, { request, response: executions });
      await dispatch(missionsSlice.actions.setExecutions(executions));
      resolve(executions);
    }).catch(async (error) => {
      console.log(`[fetchExecutionsThunk]`, { error });
      await dispatch(missionsSlice.actions.setErrorMessage(String(error)));
      reject(error);
    });
  });
};

export const removeExecutionActionThunk = (executionId: string, action: MissionAction) => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (getState().missions.loading) {
      console.log(`[removeExecutionActionThunk] already loading`);
      resolve();
      return;
    }
    await dispatch(missionsSlice.actions.setLoading(true));
    await authRefreshTokenThunk()(dispatch, getState);
    const executions = selectExecutions(getState());
    const execution = executions.find(execution => execution.execution_id === executionId);
    if (!execution) {
      console.log(`[removeExecutionActionThunk] execution not found`);
      await dispatch(missionsSlice.actions.setLoading(false));
      resolve();
      return;
    }
    // const actions = mission.actions.filter(a => (a.path !== action.path && a.action_type !== action.action_type)); // BUGGY ??!
    const newActions = execution.reviewed_actions ?? execution.original_actions;
    const actions = newActions.filter(a => (a.path !== action.path));
    rustReplaceExecutionActions(execution.execution_id, actions).then(async () => {
      console.log(`[removeExecutionActionThunk]`, { executionId, action });
      await dispatch(missionsSlice.actions.setLoading(false));
      await fetchExecutionsThunk()(dispatch, getState);
      resolve();
    }).catch(async (error) => {
      console.log(`[removeExecutionActionThunk]`, { error });
      await dispatch(missionsSlice.actions.setErrorMessage(String(error)));
      reject(error);
    });
    resolve();
  });
};

export const createExecutionThunk = (projectDir: string, message: string) => (dispatch: Dispatch, getState: () => RootState): Promise<MissionExecution> => {
  return new Promise(async (resolve, reject) => {
    await dispatch(missionsSlice.actions.setLoading(true));
    await authRefreshTokenThunk()(dispatch, getState);
    const request = { project_dir: projectDir, message };
    rustCreateMission(projectDir, message).then(async (response: MissionExecution) => {
      console.log(`[createExecutionThunk]`, { request, response });
      await fetchExecutionsThunk()(dispatch, getState);
      resolve(response);
    }).catch(error => {
      console.log(`[createExecutionThunk]`, { error });
      reject(error);
    });
  });
};

export const approveAndRunExecutionThunk = (projectDir: string, executionId: string) => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    await dispatch(missionsSlice.actions.setLoading(true));
    await authRefreshTokenThunk()(dispatch, getState);
    const request = { project_dir: projectDir, execution_id: executionId };
    rustPromptApproveAndRun(projectDir, executionId).then(async () => {
      console.log(`[approveAndRunExecutionThunk]`, { request, response: null });
      await fetchExecutionsThunk()(dispatch, getState);
      resolve();
    }).catch(async (error) => {
      console.log(`[approveAndRunExecutionThunk]`, { request, error });
      await dispatch(missionsSlice.actions.setErrorMessage(String(error)));
      reject(error);
    });
  });
};

export const retryExecutionThunk = (executionId: string, message: string) => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    await dispatch(missionsSlice.actions.setLoading(true));
    await authRefreshTokenThunk()(dispatch, getState);
    const request = { execution_id: executionId, message };
    rustRetryExecution(executionId, message).then(async () => {
      console.log(`[retryExecutionThunk]`, { request, response: null });
      await fetchExecutionsThunk()(dispatch, getState);
      resolve();
    }).catch(async (error) => {
      console.log(`[retryExecutionThunk]`, { request, error });
      await dispatch(missionsSlice.actions.setErrorMessage(String(error)));
      reject(error);
    });
  });
};

export const deleteExecutionThunk = (executionId: string) => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    await dispatch(missionsSlice.actions.setLoading(true));
    await authRefreshTokenThunk()(dispatch, getState);
    const request = { execution_id: executionId };
    rustExecutionDelete(executionId).then(async () => {
      console.log(`[deleteExecutionThunk]`, { request, response: null });
      await fetchExecutionsThunk()(dispatch, getState);
      resolve();
    }).catch(async (error) => {
      console.log(`[deleteExecutionThunk]`, { request, error });
      await dispatch(missionsSlice.actions.setErrorMessage(String(error)));
      reject(error);
    });
  });
};

export const commitExecutionLocalChangesThunk = (project_dir: string, execution_id: string) => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    await dispatch(missionsSlice.actions.setLoading(true));
    await authRefreshTokenThunk()(dispatch, getState);
    const request = { project_dir, execution_id };
    rustPromptSubmitReview(project_dir, execution_id).then(async () => {
      console.log(`[commitExecutionLocalChangesThunk]`, { request, response: null });
      await fetchExecutionsThunk()(dispatch, getState);
      resolve();
    }).catch(async (error) => {
      console.log(`[commitExecutionLocalChangesThunk]`, { request, error });
      await dispatch(missionsSlice.actions.setErrorMessage(String(error)));
      reject(error);
    });
  });
}

