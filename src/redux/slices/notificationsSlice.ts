import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum ReduxNotificationType {
  info = 'info',
  error = 'error',
};

interface ReduxNotification {
  notificationUid: string;
  message: string;
  type: ReduxNotificationType;
}

type ReduxNotificationsState = ReduxNotification[];

const initialState: ReduxNotificationsState = [];

// --- slice

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state: ReduxNotificationsState, action: PayloadAction<ReduxNotification>) => {
      const newState = [...state];
      newState.push(action.payload);
      return newState;
    },
    removeNotification: (state: ReduxNotificationsState, action: PayloadAction<string>) => {
      const newState = [...state];
      const foundIndex = newState.findIndex(notification => notification.notificationUid === action.payload);
      if (foundIndex === -1) {
        throw new Error(`[notificationsSlice.reducers.removeNotification] Notification not found: ${action.payload}`);
      }
      newState.splice(foundIndex, 1);
      return newState;
    },
  },
});

// --- thunks

export const addNotificationThunk = (type: ReduxNotificationType, message: string, time = 3000) => async (dispatch: Dispatch, getState: () => RootState) => {
  const notificationUid = `${Date.now()}`;
  dispatch(notificationsSlice.actions.addNotification({ notificationUid, message, type }));
  setTimeout(() => {
    dispatch(notificationsSlice.actions.removeNotification(notificationUid));
  }, time);
};
