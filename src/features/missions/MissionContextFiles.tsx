import { AddCircle, AddCircleOutline } from "@mui/icons-material";
import { MissionExecution, MissionExecutionContextFile, MissionExecutionStatus } from "../../services/rust/rust";
import { rustAddContextFiles } from "../../services/rust";
import { useAppDispatch } from "../../redux/hooks";
import { fetchExecutionsThunk } from "../../redux/slices/missionsSlice";

interface Props {
  execution: MissionExecution;
}

export function MissionContextFiles(props: Props) {
  const dispatch = useAppDispatch();

  const onClickAdd = async () => {
    await rustAddContextFiles(
      props.execution.mission_data.project_dir,
      props.execution.execution_id,
    );
    await dispatch(fetchExecutionsThunk());
  };

  return (
    <>
      {props.execution.execution_status === MissionExecutionStatus.Created && (
        <span className="float-right mt-1 text-slate-300 hover:text-slate-400" onClick={onClickAdd}>
          <AddCircleOutline fontSize="small" />
        </span>
      )}
      <div className="mt-2 mb-1 text-xs">context files</div>
      <div className="p-2 rounded py-1 px-2 bg-slate-100 text-xs">
        {props.execution.context_files.map((file, index) => (
          <div key={`file-${index}`}>
            <div className="">{file.path}</div>
          </div>
        ))}
      </div>
    </>
  );
}