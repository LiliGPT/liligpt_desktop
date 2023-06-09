import { useState } from "react";
import { ReduxMission, ReduxMissionAction } from "../../redux/slices/missionsSlice";
import { MissionActionItem } from "./MissionActionItem";
import { MissionActionDialog } from "./MissionActionDialog";

interface Props {
  mission: ReduxMission;
  onClickDelete?: ((action: ReduxMissionAction) => Promise<void>);
}

export function MissionActions(props: Props) {
  const { mission } = props;
  const [action, setAction] = useState<ReduxMissionAction | null>(null);

  const onClickDelete = (action: ReduxMissionAction) => {
    if (props.onClickDelete) {
      return () => props.onClickDelete!(action);
    }
  };

  return (
    <>
      <div className="">
        {mission.actions.map((action, index) => <MissionActionItem
          key={`${mission.prompt_id}-act-${index}`}
          onClick={() => setAction(action)}
          onClickDelete={onClickDelete(action)}
          {...action}
        />)}
      </div>
      <MissionActionDialog
        open={action !== null}
        onClose={() => setAction(null)}
        action={action}
      />
    </>
  );
}