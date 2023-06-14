import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { MissionInput } from "./MissionInput";
import { useAppSelector } from "../../../redux/hooks";
import { ReduxProject, selectCurrentProject } from "../../../redux/slices/projectsSlice";
import { PreparedPromptFromRust, PromptResponseFromRust, rustPromptPrepare, rustPromptCreate, rustPromptApproveAndRun, rustPromptDelete, rustPromptSubmitReview } from "../../../services/rust";
import { MissionActions } from "../../missions/MissionActions";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface MissionState {
  loading: boolean;
  prompt?: PreparedPromptFromRust;
  promptError?: Error;
  response?: PromptResponseFromRust;
  responseError?: Error;
  resultMessage?: string;
}

export function MissionDialog({ open, onClose }: Props) {
  const project: ReduxProject = useAppSelector(selectCurrentProject())!;
  // const [message, setMessage] = useState<string>("create an endpoint with a list of mocked books, remember to create the controller, model and service. Also update src/main.ts");
  const [message, setMessage] = useState<string>("");
  const [mission, setMission] = useState<MissionState>({
    loading: false,
    prompt: undefined,
    promptError: undefined,
    response: undefined,
    responseError: undefined,
    resultMessage: undefined,
  });

  const resetMission = () => {
    const newMission: MissionState = {
      loading: false,
      prompt: undefined,
      promptError: undefined,
      response: undefined,
      responseError: undefined,
      resultMessage: undefined,
    };
    setMission(newMission);
  };

  const onSubmitMission = async () => {
    if (mission.response?.mission_id) {
      await onClickDeletePromptButton();
    }
    setMission({
      loading: true,
      prompt: undefined,
      promptError: undefined,
      response: undefined,
      responseError: undefined,
      resultMessage: undefined,
    });
    let prompt: PreparedPromptFromRust | undefined;
    try {
      prompt = await rustPromptPrepare(project.projectDir, message);
    } catch (e) {
      console.error(e);
      setMission({
        loading: false,
        prompt: undefined,
        promptError: e as Error,
        response: undefined,
        responseError: undefined,
        resultMessage: undefined,
      });
      return;
    }
    let response: PromptResponseFromRust | undefined;
    try {
      response = await rustPromptCreate(project.projectDir, prompt);
    } catch (e) {
      console.error(e);
      setMission({
        loading: false,
        prompt: undefined,
        promptError: undefined,
        response: undefined,
        responseError: e as Error,
        resultMessage: undefined,
      });
      return;
    }
    setMission({
      loading: false,
      prompt,
      promptError: undefined,
      response,
      responseError: undefined,
      resultMessage: undefined,
    });
  };

  const onClickDeletePromptButton = async () => {
    setMission({
      ...mission,
      loading: true,
    });
    await rustPromptDelete(mission.response!.mission_id);
    resetMission();
  };

  const onApprovePrompt = async () => {
    setMission({
      ...mission,
      loading: true,
    });
    await rustPromptApproveAndRun(project.projectDir, mission.response!.mission_id);
    setMission({
      ...mission,
      loading: false,
      resultMessage: 'Mission complete!',
    });
    setMessage('');
  };

  const onClickSetMissionFailed = async () => {
    await onClickDeletePromptButton();
  };

  const onClickCloseMission = () => {
    resetMission();
  };

  // ideias:
  // - antes de abrir o modal de missões eu podia exigir que tenha um repo git e que ele esteja sem alterações no git status + um botão de retry
  // - o botão de "reverter" poderia reverter as alterações do git
  const onClickSendReviewMission = async () => {
    await rustPromptSubmitReview(project.projectDir, mission.response!.mission_id);
    resetMission();
  };

  let content;

  if (mission.response) {
    // success response
    content = (
      <div className="text-xs">
        <div
          className="mb-2"
        >action plan: ({mission.response.mission_id})</div>
        <MissionActions execution={mission.response} />
        {!mission.loading && !mission.resultMessage && (
          <div className="mb-6 py-2">
            <button
              onClick={onClickDeletePromptButton}
              className="px-2 py-0.5 mt-0.5 bg-red-100 border-red-200 hover:bg-red-200 hover:border-red-300 border-2 rounded-md cursor-pointer"
            >cancel</button>
            <button
              onClick={onApprovePrompt}
              className="px-2 py-0.5 mt-0.5 bg-green-100 border-green-200 hover:bg-green-200 hover:border-green-300 border-2 rounded-md ml-1 cursor-pointer"
            >approve</button>
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
  } else if (mission.responseError) {
    content = (
      <div className="text-xs">
        response error:
        <pre>{JSON.stringify(mission.responseError, null, 2)}</pre>
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
                onClick={onClickSetMissionFailed}
                className="px-2 py-0.5 mt-0.5 bg-red-100 border-red-200 hover:bg-red-200 hover:border-red-300 border-2 rounded-md cursor-pointer"
              >set failed</button>
              <button
                onClick={onClickSendReviewMission}
                className="px-2 py-0.5 mt-0.5 bg-green-100 border-green-200 hover:bg-green-200 hover:border-green-300 border-2 rounded-md ml-1 cursor-pointer"
              >commit local changes</button>
              <button
                onClick={onClickCloseMission}
                className="px-2 py-0.5 mt-0.5 bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 border-2 rounded-md ml-1 cursor-pointer"
              >close mission</button>

            </div>
          </>
        )}
      </div>
      <DialogActions>
        <MissionInput
          value={message}
          disabled={mission.loading}
          onChange={v => setMessage(v)}
          onSubmit={onSubmitMission} />
      </DialogActions>
    </Dialog>
  )
}

