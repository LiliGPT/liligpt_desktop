import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { selectProjectDir } from "./projectsSlice";
import { rustGetTestScripts, rustRunShellCommand } from "../../services/rust";

interface ReduxTest {
  testUid: string;
  projectUid: string;
  displayName: string;
  command: string;
  coverage: number;
  coverageFolder: string;
  isLoading: boolean;
  isSuccess: boolean | null;
  output: string;
}

type ReduxTestsState = ReduxTest[];

const initialState: ReduxTestsState = [];

// --- slice

export const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    addTest: (state: ReduxTestsState, action: PayloadAction<ReduxTest>) => {
      const newState = [...state];
      const foundIndex = newState.findIndex(test => test.testUid === action.payload.testUid);
      if (foundIndex > -1) {
        throw new Error(`[testsSlice.reducers.addTest] Test already exists: ${action.payload.testUid}`);
      }
      newState.push(action.payload);
      return newState;
    },
    removeTest: (state: ReduxTestsState, action: PayloadAction<string>) => {
      const newState = [...state];
      const foundIndex = newState.findIndex(test => test.testUid === action.payload);
      if (foundIndex === -1) {
        throw new Error(`[testsSlice.reducers.removeTest] Test not found: ${action.payload}`);
      }
      newState.splice(foundIndex, 1);
      return newState;
    },
    setTestLoading: (state: ReduxTestsState, action: PayloadAction<{ testUid: string }>) => {
      const newState = [...state];
      const foundIndex = newState.findIndex(test => test.testUid === action.payload.testUid);
      if (foundIndex === -1) {
        throw new Error(`[testsSlice.reducers.setTestLoading] Test not found: ${action.payload.testUid}`);
      }
      newState[foundIndex].isLoading = true;
      newState[foundIndex].output = '';
      return newState;
    },
    setTestError: (state: ReduxTestsState, action: PayloadAction<{ testUid: string, output: string }>) => {
      const newState = [...state];
      const foundIndex = newState.findIndex(test => test.testUid === action.payload.testUid);
      if (foundIndex === -1) {
        throw new Error(`[testsSlice.reducers.setTestError] Test not found: ${action.payload.testUid}`);
      }
      newState[foundIndex].output = action.payload.output;
      newState[foundIndex].isLoading = false;
      return newState;
    },
    setTestOutput: (state: ReduxTestsState, action: PayloadAction<{ testUid: string, output: string }>) => {
      const newState = [...state];
      const foundIndex = newState.findIndex(test => test.testUid === action.payload.testUid);
      if (foundIndex === -1) {
        throw new Error(`[testsSlice.reducers.setTestOutput] Test not found: ${action.payload.testUid}`);
      }
      newState[foundIndex].output = action.payload.output;
      newState[foundIndex].isLoading = false;
      return newState;
    },
  },
});

// --- selectors

export const selectTestsFromProject = (projectUid: string) => (state: RootState): ReduxTest[] => {
  return state.tests.filter(test => test.projectUid === projectUid);
};

export const selectTestFromCommand = (projectUid: string, command: string) => (state: RootState): ReduxTest | undefined => {
  return state.tests.find(test => test.projectUid === projectUid && test.command === command);
};

// --- thunks

export const fetchTestsFromProjectThunk = (projectUid: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch(testsSlice.actions.setTestLoading({ testUid: projectUid }));
  const projectDir = selectProjectDir(projectUid)(getState());
  if (!projectDir) {
    throw new Error(`[fetchTestsFromProjectThunk] Project directory not found: ${projectUid}`);
  }
  const rustTestScripts: {
    [testKey: string]: string;
  } = await rustGetTestScripts(projectDir);
  const tests: ReduxTest[] = Object.keys(rustTestScripts).map(testKey => {
    return {
      testUid: `${projectUid}-${testKey}`,
      projectUid,
      displayName: testKey,
      command: rustTestScripts[testKey],
      coverage: 0,
      coverageFolder: '',
      isLoading: false,
      errorMessage: '',
      output: '',
      isSuccess: null,
    };
  });
  for (const test of tests) {
    try {
      await dispatch(testsSlice.actions.addTest(test));
    } catch (error) {
      // await dispatch(testsSlice.actions.setTestError({ testUid: test.testUid, errorMessage: String(error) }));
      console.log(`Error adding test: ${test.testUid}`);
    }
  }
};

export const runTestThunk = (projectUid: string, command: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch(testsSlice.actions.setTestLoading({ testUid: projectUid }));
  const test: ReduxTest | undefined = selectTestFromCommand(projectUid, command)(getState());
  const projectDir = selectProjectDir(projectUid)(getState());
  if (!test) {
    throw new Error(`[runTestThunk] Test not found: ${projectUid} ${command}`);
  }
  if (!projectDir) {
    throw new Error(`[runTestThunk] Project directory not found: ${projectUid}`);
  }
  try {
    const output = await rustRunShellCommand(projectDir, command);
    await dispatch(testsSlice.actions.setTestOutput({ testUid: projectUid, output }));
  } catch (error) {
    await dispatch(testsSlice.actions.setTestError({ testUid: projectUid, output: _parseTestErrorOutput(error) }));
  }
};

function _parseTestErrorOutput(output: any) {
  let newOutput = String(output);
  // catch code errors
  if (Error.prototype.isPrototypeOf(output)) {
    return newOutput;
  }
  // catch non jest errors
  if (!newOutput.includes('Test Suites:')) {
    return newOutput;
  }
  // remove all color codes
  newOutput = newOutput.replace(/\x1b\[[0-9;]*m/g, '');
  // remove all \r
  newOutput = newOutput.replace(/\r/g, '');
  // split each test result individually
  const splitString = '\n  ● ';
  let testResultArray: string[] = newOutput.split(splitString);
  // remove first element
  testResultArray = testResultArray.slice(1);
  // the last element will have coverage results, let's remove the coverage
  testResultArray.push(testResultArray.pop()!.split('\n\n--')[0]);
  // parse each test result
  for (const i in testResultArray) {
    let individualResult: string = testResultArray[i];
    if (individualResult.includes('error TS')) {
      individualResult = individualResult.split('\n\n')[1];
    } else {
      // first, lets remove the first and last parts (separated by \n\n)
      const splitString = '\n\n';
      const splitResult = individualResult.split(splitString);
      splitResult.shift();
      splitResult.pop();
      individualResult = splitResult.join(splitString);
    }
    // add the result back
    testResultArray[i] = individualResult;
  }
  // lets get the first two tests
  testResultArray = testResultArray.slice(0, 1);

  return testResultArray.join("\n\n  ------------------  \n\n");
}

