import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { rustFetchMissions } from "../../services/rust";
import { RootState } from "../store";

// --- initial state

const initialState: ReduxMissionsState = {
  loading: false,
  errorMessage: '',
  missions: [],
};

interface ReduxMissionsState {
  loading: boolean;
  errorMessage: string;
  missions: ReduxMission[];
}

export enum ReduxMissionStatus {
  Ok = 'Ok',
  Approved = 'Approved',
  Fail = 'Fail',
  InProgress = 'InProgress',
}

export interface ReduxMission {
  prompt_id: string;
  status: ReduxMissionStatus;
  message: string;
  actions: ReduxMissionAction[],
  original_actions: ReduxMissionAction[],
  created_at: string;
  updated_at: string;
}

export interface ReduxMissionAction {
  action_type: string; // create_file | update_file
  content: string | null;
  path: string;
}

// --- slice

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setLoading: (state: ReduxMissionsState, action: { payload: boolean }) => {
      return {
        ...state,
        loading: action.payload,
        errorMessage: '',
      };
    },
    setErrorMessage: (state: ReduxMissionsState, action: { payload: string }) => {
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    },
    setMissions: (state: ReduxMissionsState, action: { payload: ReduxMission[] }) => {
      return {
        ...state,
        loading: false,
        missions: action.payload,
      };
    },
  },
});

// --- selectors

export const selectMissions = (state: { missions: ReduxMissionsState }): ReduxMission[] => {
  return state.missions.missions;
};

// --- thunks

export const fetchMissionsThunk = () => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (getState().missions.loading) {
      console.log(`[fetchMissionsThunk] already loading`);
      resolve();
      return;
    }
    await dispatch(missionsSlice.actions.setLoading(true));
    rustFetchMissions().then(async (missions: ReduxMission[]) => {
      console.log(`[fetchMissionsThunk]`, { missions });
      await dispatch(missionsSlice.actions.setMissions(missions));
      resolve();
    }).catch(error => {
      console.log(`[fetchMissionsThunk]`, { error });
      reject(error);
    });
  });
};
