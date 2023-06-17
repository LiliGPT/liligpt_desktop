import { useCallback, useState } from "react";
import { MissionActionItem } from "./MissionActionItem";
import { MissionActionDialog } from "./MissionActionDialog";
import { MissionAction, MissionExecution, MissionExecutionContextFile } from "../../services/rust/rust";

interface Props {
  execution: MissionExecution;
  onClickDelete?: ((action: MissionAction) => Promise<void>);
}

export function MissionActions(props: Props) {
  const { execution } = props;
  const [action, setAction] = useState<MissionAction | null>(null);
  const actions: MissionAction[] = execution.reviewed_actions ?? execution.original_actions ?? [];

  const onClickDelete = (action: MissionAction) => {
    if (props.onClickDelete) {
      return () => props.onClickDelete!(action);
    }
  };

  return (
    <>
      <div className="">
        {actions.map((action, index) => <MissionActionItem
          key={`${execution.mission_id}-act-${index}`}
          onClick={() => setAction(action)}
          onClickDelete={onClickDelete(action)}
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