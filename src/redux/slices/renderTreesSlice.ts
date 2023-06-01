import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RenderTree } from "../../services/rust";

interface ReduxRenderTree {
  projectUid: string;
  tree: RenderTree;
}

type ReduxRenderTreesState = ReduxRenderTree[];

const initialState: ReduxRenderTreesState = [];

// --- slice

export const renderTreesSlice = createSlice({
  name: 'renderTrees',
  initialState,
  reducers: {
    setRenderTree: (state: ReduxRenderTreesState, action: PayloadAction<ReduxRenderTree>) => {
      const newState = { ...state };
      const foundIndex = newState.findIndex(renderTree => renderTree.projectUid === action.payload.projectUid);
      if (foundIndex > 0) {
        newState[foundIndex] = action.payload;
      } else {
        newState.push(action.payload);
      }
      return newState;
    },
  },
});
