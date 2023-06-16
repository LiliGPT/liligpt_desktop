import { useState } from "react";
import { fetchExecutionsThunk, removeExecutionActionThunk } from "../../redux/slices/missionsSlice";
import { MissionActions } from "./MissionActions";
import { Close, Edit } from "@mui/icons-material";
import { CustomButton } from "../buttons/CustomButton";
import { rustExecutionDelete, rustExecutionSetPerfect, rustPromptSubmitReview } from "../../services/rust";
import { useAppDispatch } from "../../redux/hooks";
import { MissionAction, MissionExecution, MissionExecutionStatus } from "../../services/rust/rust";

interface Props extends MissionExecution { }

export function MissionItem(execution: Props) {
  const dispatch = useAppDispatch();
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onClickFail = async () => {
    setLoading(true);
    await rustExecutionDelete(execution.execution_id);
    await dispatch(fetchExecutionsThunk());
    setLoading(false);
    setEditionMode(false);
  };

  const onClickSetPerfect = async () => {
    setLoading(true);
    await rustExecutionSetPerfect(execution.execution_id);
    await dispatch(fetchExecutionsThunk());
    setLoading(false);
    setEditionMode(false);
  };

  let onClickDeleteFile: ((action: MissionAction) => Promise<void>) | undefined;
  if (!loading && editionMode) {
    onClickDeleteFile = async (action: MissionAction) => {
      setLoading(true);
      await dispatch(removeExecutionActionThunk(execution.execution_id, action));
      setLoading(false);
      setEditionMode(false);
    };
  };

  const onClickCommitLocalFiles = async () => {
    setLoading(true);
    await rustPromptSubmitReview(
      execution.mission_data.project_dir,
      execution.execution_id,
    );
    await dispatch(fetchExecutionsThunk());
    setLoading(false);
    setEditionMode(false);
  };

  let editModeIconButton;
  if (!loading && execution.execution_status !== MissionExecutionStatus.Fail) {
    editModeIconButton = !editionMode ? (
      <div className="float-right">
        <Edit fontSize="small" onClick={() => setEditionMode(true)} />
      </div>
    ) : (
      <div className="float-right">
        <Close fontSize="small" onClick={() => setEditionMode(false)} />
      </div>
    );
  }
  const canSetFail = !loading && editionMode && (execution.execution_status === MissionExecutionStatus.Perfect
    || execution.execution_status === MissionExecutionStatus.Approved
    || execution.execution_status === MissionExecutionStatus.Created);
  const canSetPerfect = !loading && editionMode && (execution.execution_status === MissionExecutionStatus.Approved);
  const canCommitLocalFiles = !loading && editionMode && (execution.execution_status === MissionExecutionStatus.Created
    || execution.execution_status === MissionExecutionStatus.Approved);
  const setFailButton = !loading && canSetFail && (
    <CustomButton
      label="set fail"
      onClick={onClickFail}
      size="small"
      color="text-error"
    />
  );
  const setPerfectButton = canSetPerfect && (
    <CustomButton
      label="set perfect"
      onClick={onClickSetPerfect}
      size="small"
      color="text-success"
    />
  );
  const commitLocalFiles = canCommitLocalFiles && (
    <CustomButton
      label="commit local files"
      onClick={onClickCommitLocalFiles}
      size="small"
      color="text-success"
    />
  );

  return (
    <div
      className="border rounded-md px-2 py-1 my-2 bg-slate-200 border-gray-300 text-xs"
      key={execution.execution_id}
    >
      {editModeIconButton}
      <div className="text-sm">{execution.mission_data.message}</div>
      <div className="text-xs text-slate-500">
        {execution.execution_status} ({execution.execution_id})
        {setFailButton}
        {setPerfectButton}
        {commitLocalFiles}
      </div>
      <MissionActions execution={execution} onClickDelete={onClickDeleteFile} />
    </div>
  );
}
