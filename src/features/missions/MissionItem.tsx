import { useState } from "react";
import { ReduxMission, ReduxMissionAction, ReduxMissionStatus, fetchMissionsThunk, removeMissionActionThunk } from "../../redux/slices/missionsSlice";
import { MissionActions } from "./MissionActions";
import { Close, Edit } from "@mui/icons-material";
import { CustomButton } from "../buttons/CustomButton";
import { rustPromptDelete, rustPromptSetOk, rustPromptSubmitReview } from "../../services/rust";
import { useAppDispatch } from "../../redux/hooks";

interface Props extends ReduxMission { }

export function MissionItem(mission: Props) {
  const dispatch = useAppDispatch();
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onClickFail = async () => {
    setLoading(true);
    await rustPromptDelete(mission.prompt_id);
    await dispatch(fetchMissionsThunk());
    setLoading(false);
    setEditionMode(false);
  };

  const onClickConfirm = async () => {
    setLoading(true);
    await rustPromptSetOk(mission.prompt_id);
    await dispatch(fetchMissionsThunk());
    setLoading(false);
    setEditionMode(false);
  };

  let onClickDeleteFile: ((action: ReduxMissionAction) => Promise<void>) | undefined;
  if (!loading && editionMode) {
    onClickDeleteFile = async (action: ReduxMissionAction) => {
      setLoading(true);
      await dispatch(removeMissionActionThunk(mission.prompt_id, action));
      setLoading(false);
      setEditionMode(false);
    };
  }

  let editModeIconButton;
  if (!loading && mission.status !== ReduxMissionStatus.Fail) {
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
  const canSetFail = !loading && editionMode && (mission.status === ReduxMissionStatus.Ok
    || mission.status === ReduxMissionStatus.Approved
    || mission.status === ReduxMissionStatus.InProgress);
  const canConfirm = !loading && editionMode && (mission.status === ReduxMissionStatus.Approved);
  const setFailButton = !loading && canSetFail && (
    <CustomButton
      label="set fail"
      onClick={onClickFail}
      size="small"
      color="text-error"
    />
  );
  const confirmButton = canConfirm && (
    <CustomButton
      label="confirm"
      onClick={onClickConfirm}
      size="small"
      color="text-success"
    />
  );

  return (
    <div
      className="border rounded-md px-2 py-1 my-2 bg-slate-200 border-gray-300 text-xs"
      key={mission.prompt_id}
    >
      {editModeIconButton}
      <div className="text-sm">{mission.message}</div>
      <div className="text-xs text-slate-500">
        {mission.status} ({mission.prompt_id})
        {setFailButton}
        {confirmButton}
      </div>
      <MissionActions mission={mission} onClickDelete={onClickDeleteFile} />
    </div>
  );
}
