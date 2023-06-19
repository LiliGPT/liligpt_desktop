import { useCallback, useState } from "react";
import { MissionActionItem } from "./MissionActionItem";
import { MissionActionDialog } from "./MissionActionDialog";
import { MissionAction, MissionExecution, MissionExecutionContextFile } from "../../services/rust/rust";

interface Props {
  execution: MissionExecution;
  canDelete: boolean;
  // onClickDelete?: ((action: MissionAction) => Promise<void>);
}

export function MissionActions(props: Props) {
  const { execution, canDelete } = props;
  const [action, setAction] = useState<MissionAction | null>(null);
  const actions: MissionAction[] = execution.reviewed_actions ?? execution.original_actions ?? [];

  return (
    <>
      <div className="">
        {actions.map((action, index) => <MissionActionItem
          key={`${execution.mission_id}-act-${index}`}
          execution_id={execution.execution_id}
          onClick={() => setAction(action)}
          canDelete={canDelete && actions.length > 1}
          {...action}
        />)}
      </div>
      <MissionActionDialog
        open={action !== null}
        onClose={() => setAction(null)}
        action={action}
        contextFiles={execution.context_files}
      />
    </>
  );
}