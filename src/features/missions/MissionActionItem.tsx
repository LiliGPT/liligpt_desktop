import { Delete } from "@mui/icons-material";
import { MissionAction, MissionExecutionContextFile } from "../../services/rust/rust";
import { useAppDispatch } from "../../redux/hooks";
import { removeExecutionActionThunk } from "../../redux/slices/missionsSlice";

interface Props extends MissionAction {
  execution_id: string;
  onClick: () => void;
  canDelete: boolean;
}

export function MissionActionItem(props: Props) {
  const dispatch = useAppDispatch();

  const onClickDelete = async () => {
    await dispatch(removeExecutionActionThunk(props.execution_id, props));
  };

  return (
    <div className="my-0.5">
      {!!props.canDelete && (
        <div
          onClick={onClickDelete}
          className="float-right text-red-700 hover:bg-red-200 rounded py-0.5 px-1 opacity-70"
        >
          <Delete fontSize="small" />
        </div>
      )}
      <div onClick={props.onClick} className="rounded py-1 px-2 bg-slate-100 text-xs cursor-pointer">
        {props.action_type} - {props.path}
      </div>
      <div className="clear-both"></div>
    </div>
  )
}