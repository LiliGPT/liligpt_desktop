import { Delete } from "@mui/icons-material";
import { MissionAction } from "../../services/rust/rust";

interface Props extends MissionAction {
  onClick: () => void;
  onClickDelete?: () => void;
}

export function MissionActionItem(props: Props) {
  return (
    <div className="my-0.5">
      {!!props.onClickDelete && (
        <div
          onClick={props.onClickDelete}
          className="float-right text-red-700 hover:bg-red-200 rounded py-0.5 px-1 opacity-70"
        >
          <Delete fontSize="small" />
        </div>
      )}
      <div onClick={props.onClick} className="rounded py-1 px-2 bg-slate-100 text-xs cursor-pointer">
        {props.action_type} - {props.path}
      </div>
    </div>
  )
}