import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ReduxShellLog {
  shellTaskUid: string;
  message: string;
  timestamp: number;
  type: 'normal' | 'internal' | 'error';
}

type ReduxShellLogsState = ReduxShellLog[];

const initialState: ReduxShellLogsState = [];

// --- slice

export const shellLogsSlice = createSlice({
  name: 'shellLogs',
  initialState,
  reducers: {
    addShellLog: (state: ReduxShellLogsState, action: PayloadAction<ReduxShellLog>) => {
      const newState = [...state];
      newState.push({
        ...action.payload,
        message: convertToHtml(action.payload.message),
      });
      return newState;
    },
  },
});

// --- selectors

export const selectShellLogsByShellTaskId = (shellTaskUid: string) => (state: RootState): ReduxShellLog[] => {
  return state.shellLogs.filter(shellLog => shellLog.shellTaskUid === shellTaskUid);
};

// --- actions

export const { addShellLog } = shellLogsSlice.actions;

// --- utils

function convertToHtml(input: string) {
  let output = '';

  const colorStack = [];

  const lines = input.split('\n');

  for (const line of lines) {
    let lineOutput = '';
    let openTags = '';

    let pos = 0;

    while (pos < line.length) {
      const colorStart = line.indexOf('[', pos);
      if (colorStart === -1) {
        lineOutput += line.slice(pos);
        break;
      }

      lineOutput += line.slice(pos, colorStart);

      const colorEnd = line.indexOf('m', colorStart);
      if (colorEnd === -1) {
        lineOutput += line.slice(colorStart);
        break;
      }

      const controlSeq = line.slice(colorStart, colorEnd + 1);
      pos = colorEnd + 1;

      if (controlSeq === '[0m') {
        while (colorStack.length) {
          const openTag = colorStack.pop();
          lineOutput += `</${openTag}>`;
        }
      } else {
        const colorCode = controlSeq.slice(1, controlSeq.length - 1);

        let tagName;
        switch (colorCode) {
          case '30':
            tagName = 'span style="color: black"';
            break;
          case '31':
            tagName = 'span style="color: red"';
            break;
          case '32':
            tagName = 'span style="color: green"';
            break;
          case '33':
            tagName = 'span style="color: yellow"';
            break;
          case '34':
            tagName = 'span style="color: blue"';
            break;
          case '35':
            tagName = 'span style="color: magenta"';
            break;
          case '36':
            tagName = 'span style="color: cyan"';
            break;
          case '37':
            tagName = 'span style="color: white"';
            break;
          default:
            continue;
        }

        lineOutput += `<${tagName}>`;
        openTags += tagName;
        colorStack.push(tagName);
      }
    }

    output += `${lineOutput}<br />\n`;

    if (openTags !== '') {
      while (colorStack.length) {
        const openTag = colorStack.pop();
        output += `</${openTag}>`;
      }
    }
  }

  return output;
}