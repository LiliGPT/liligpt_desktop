import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ReduxMission, ReduxMissionAction, fetchMissionsThunk, selectMissions } from "../../redux/slices/missionsSlice";
import { MissionItem } from "./MissionItem";

export function MissionsView() {
  const dispatch = useAppDispatch();
  const missions = useAppSelector(selectMissions);

  useEffect(() => {
    dispatch(fetchMissionsThunk());
  }, []);

  const missionsComponents = missions.map((mission: ReduxMission) => <MissionItem key={mission.prompt_id} {...mission} />);

  return (
    <div className="p-2 max-w-2xl">
      <h1>Missions History</h1>
      <div className="">
        {missionsComponents}
      </div>
    </div>
  );
}