import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { MissionInput } from "./MissionInput";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ReduxProject, selectCurrentProject } from "../../../redux/slices/projectsSlice";
import { MissionActions } from "../../missions/MissionActions";
import { MissionExecution } from "../../../services/rust/rust";
import { MissionContextFiles } from "../../missions/MissionContextFiles";
import { approveAndRunExecutionThunk, commitExecutionLocalChangesThunk, createExecutionThunk, deleteExecutionThunk, retryExecutionThunk, selectExecutions } from "../../../redux/slices/missionsSlice";
import { useSelector } from "react-redux";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface MissionState {
  loading: boolean;
  prompt?: MissionExecution;
  promptError?: Error;
  resultMessage?: string;
}

export function MissionDialog({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const project: ReduxProject = useAppSelector(selectCurrentProject())!;
  // const [message, setMessage] = useState<string>("create an endpoint with a list of mocked books, remember to create the controller, model and service. Also update src/main.ts");
  const [message, setMessage] = useState<string>("");
  const [mission, setMission] = useState<MissionState>({
    loading: false,
    prompt: undefined,
    promptError: undefined,
    resultMessage: undefined,
  });

  const resetMission = () => {
    const newMission: MissionState = {
      loading: false,
      prompt: undefined,
      promptError: undefined,
      resultMessage: undefined,
    };
    setMission(newMission);
  };

  const onSubmitMission = async () => {
    if (mission.prompt?.execution_id) {
      // await onClickDeletePromptButton();
      await onRetryPrompt();
      return;
    }
    setMission({
      loading: true,
      prompt: undefined,
      promptError: undefined,
      resultMessage: undefined,
    });
    let prompt: MissionExecution | undefined;
    try {
      prompt = await dispatch(createExecutionThunk(project.projectDir, message));
    } catch (e) {
      console.error(e);
      setMission({
        loading: false,
        prompt: undefined,
        promptError: e as Error,
        resultMessage: undefined,
      });
      return;
    }
    setMission({
      loading: false,
      prompt,
      promptError: undefined,
      resultMessage: undefined,
    });
  };

  const execution = useSelector(selectExecutions).find(e => e.execution_id === mission.prompt?.execution_id);

  const onClickDeletePromptButton = async () => {
    setMission({
      ...mission,
      loading: true,
    });
    await dispatch(deleteExecutionThunk(mission.prompt!.execution_id));
    resetMission();
  };

  const onApprovePrompt = async () => {
    setMission({
      ...mission,
      loading: true,
    });
    await dispatch(approveAndRunExecutionThunk(project.projectDir, mission.prompt!.execution_id));
    setMission({
      ...mission,
      loading: false,
      resultMessage: 'Mission complete!',
    });
    setMessage('');
  };

  const onClickCommitLocalFiles = async () => {
    setMission({
      ...mission,
      loading: true,
    });
    await dispatch(commitExecutionLocalChangesThunk(project.projectDir, mission.prompt!.execution_id));
    setMission({
      ...mission,
      loading: false,
    });
  };

  const onRetryPrompt = async () => {
    setMission({
      ...mission,
      loading: true,
    });
    try {
      await dispatch(retryExecutionThunk(mission.prompt!.execution_id, message));
      setMission({
        ...mission,
        loading: false,
      });
    } catch (e) {
      console.error(e);
      setMission({
        ...mission,
        loading: false,
        resultMessage: String(e),
        promptError: e as Error,
      });
      return;
    }
  };

  const onClickSetMissionFailed = async () => {
    await onClickDeletePromptButton();
  };

  const onClickCloseMission = () => {
    resetMission();
  };

  let content;

  if (mission.prompt && execution) {
    // success response
    content = (
      <div className="text-xs">
        <div
          className="mb-2"
        >action plan: ({execution.execution_id})</div>
        <MissionActions execution={execution} canDelete={!mission.resultMessage} />
        <MissionContextFiles execution={execution} />
        {!mission.loading && !mission.resultMessage && (
          <div className="mb-6 py-2">
            <button
              onClick={onClickDeletePromptButton}
              className="px-2 py-0.5 mt-0.5 bg-red-100 border-red-200 hover:bg-red-200 hover:border-red-300 border-2 rounded-md cursor-pointer"
            >cancel</button>
            <button
              onClick={onApprovePrompt}
              className="px-2 py-0.5 mt-0.5 bg-green-100 border-green-200 hover:bg-green-200 hover:border-green-300 border-2 rounded-md ml-1 cursor-pointer"
            >approve and run</button>
          </div>
        )}
      </div>
    );
  } else if (mission.promptError) {
    content = (
      <div className="text-xs">
        prompt error:
        <pre>{JSON.stringify(mission.promptError, null, 2)}</pre>
      </div>
    );
  } else if (mission.promptError) {
    content = (
      <div className="text-xs">
        response error:
        <pre>{JSON.stringify(mission.promptError, null, 2)}</pre>
      </div>
    );
  } else if (mission.prompt) {
    // todo: delete this else if, it's here for debug purposes
    content = (
      <div className="text-xs h-80 overflow-auto">
        prompt:
        <pre>{JSON.stringify(mission.prompt, null, 2)}</pre>
      </div>
    );
  } else {
    content = (
      <></>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Active Mission</DialogTitle>
      <div className="px-6">
        {content}
        {mission.loading && (
          <div className="py-10 text-center text-gray-500">
            loading...
          </div>
        )}
        {!!mission.resultMessage && (
          <>
            <div className="pt-5 pb-2 text-green-700">
              {mission.resultMessage}
            </div>
            <div className="text-xs pb-8">
              <button
                disabled={mission.loading}
                onClick={onClickCommitLocalFiles}
                className="px-2 py-0.5 mt-0.5 bg-blue-100 border-blue-200 hover:bg-blue-200 hover:border-blue-300 border-2 rounded-md cursor-pointer"
              >commit local changes</button>
              <button
                disabled={mission.loading}
                onClick={onClickSetMissionFailed}
                className="ml-1 px-2 py-0.5 mt-0.5 bg-red-100 border-red-200 hover:bg-red-200 hover:border-red-300 border-2 rounded-md cursor-pointer"
              >set failed</button>
              <button
                disabled={mission.loading}
                onClick={onClickCloseMission}
                className="ml-1 px-2 py-0.5 mt-0.5 bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 border-2 rounded-md cursor-pointer"
              >close mission</button>
            </div>
          </>
        )}
      </div>
      {!mission.resultMessage && (
        <DialogActions>
          <MissionInput
            value={message}
            disabled={mission.loading}
            buttonLabel={mission.prompt ? 'Retry' : 'Ask'}
            onChange={v => setMessage(v)}
            onSubmit={onSubmitMission} />
        </DialogActions>
      )}
    </Dialog>
  )
}

