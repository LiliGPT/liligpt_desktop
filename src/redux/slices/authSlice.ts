import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { rustAuthLogin, rustRefreshToken } from "../../services/rust";
import { RootState } from "../store";
import * as jose from 'jose';

// --- initial state

const initialState: ReduxAuthState = {
  accessToken: '',
  accessTokenExp: 0,
  refreshToken: '',
  loading: false,
  errorMessage: '',
  user: null,
};

interface ReduxAuthState {
  accessToken: string;
  accessTokenExp: number;
  refreshToken: string;
  loading: boolean;
  errorMessage: string;
  user: ReduxCurrentUser | null;
}

interface ReduxCurrentUser {
  sub: string;
  name: string;
  email: string;
}

// --- slice

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state: ReduxAuthState, action: PayloadAction<ReduxAuthPayload>): ReduxAuthState => {
      const decoded = jose.decodeJwt(action.payload.accessToken);
      let user: ReduxCurrentUser | null = null;
      if (decoded) {
        user = {
          sub: decoded['sub'] as string,
          name: decoded['name'] as string,
          email: decoded['email'] as string,
        };
      }
      return {
        ...state,
        loading: false,
        errorMessage: '',
        accessToken: action.payload.accessToken,
        accessTokenExp: (decoded.exp ?? 0) * 1000,
        refreshToken: action.payload.refreshToken,
        user,
      };
    },
    setLoading: (state: ReduxAuthState, action: PayloadAction<boolean>) => {
      return {
        ...state,
        loading: action.payload,
        errorMessage: '',
      };
    },
    setErrorMessage: (state: ReduxAuthState, action: PayloadAction<string>) => {
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    },
  },
});

export interface ReduxAuthPayload {
  accessToken: string;
  refreshToken: string;
}

// --- selectors

export const selectCurrentUser = () => (state: { auth: ReduxAuthState }): ReduxCurrentUser | null => {
  return state.auth.user;
}

export const selectAccessToken = () => (state: { auth: ReduxAuthState }): string => {
  return state.auth.accessToken;
}

// --- thunks

export const authLoginThunk = (username: string, password: string) => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    dispatch(authSlice.actions.setLoading(true));
    rustAuthLogin(username, password).then((response: ReduxAuthPayload) => {
      console.log(`[authLoginThunk] response: `, { response });
      dispatch(authSlice.actions.setAuth(response));
      resolve();
    }).catch((error: string) => {
      console.log(`[authLoginThunk] error: `, { error });
      dispatch(authSlice.actions.setErrorMessage(error));
      reject(error);
    });
  });
};

export const authRefreshTokenThunk = () => (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const { refreshToken, accessToken, accessTokenExp } = getState().auth;
    const five_seconds = 5 * 1000;
    if (Date.now() <= accessTokenExp - five_seconds) {
      console.log(`[authRefreshTokenThunk] accessToken still valid`);
      resolve();
      return;
    }
    dispatch(authSlice.actions.setLoading(true));
    rustRefreshToken(refreshToken).then((response: ReduxAuthPayload) => {
      console.log(`[authRefreshTokenThunk] token refreshed!`);
      dispatch(authSlice.actions.setAuth(response));
      resolve();
    }).catch((error: string) => {
      console.log(`[authRefreshTokenThunk] refresh token error: `, { error });
      dispatch(authSlice.actions.setErrorMessage(error));
      reject(error);
    });
  });
};
