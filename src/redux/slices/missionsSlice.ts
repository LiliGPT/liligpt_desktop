import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { rustFetchMissions, rustReplaceExecutionActions, rustSearchExecutions } from "../../services/rust";
import { RootState } from "../store";
import { MissionAction, MissionExecution } from "../../services/rust/rust";

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

export const fetchExecutionsThunk = () => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    // if (getState().missions.loading) {
    //   console.log(`[fetchExecutionsThunk] already loading`);
    //   resolve();
    //   return;
    // }
    await dispatch(missionsSlice.actions.setLoading(true));
    const request = {
      filter: {
        'execution_status': { '$ne': 'Fail' }
      }
    };
    rustSearchExecutions(request).then(async (executions: MissionExecution[]) => {
      console.log(`[fetchExecutionsThunk]`, { request, response: executions });
      await dispatch(missionsSlice.actions.setExecutions(executions));
      resolve();
    }).catch(error => {
      console.log(`[fetchExecutionsThunk]`, { error });
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
    await rustReplaceExecutionActions(execution.execution_id, actions);
    await dispatch(missionsSlice.actions.setLoading(false));
    await fetchExecutionsThunk()(dispatch, getState);
    resolve();
  });
};
