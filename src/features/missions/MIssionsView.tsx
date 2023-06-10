import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ReduxMission, ReduxMissionAction, fetchMissionsThunk, selectMissions } from "../../redux/slices/missionsSlice";
import { MissionItem } from "./MissionItem";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

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
      <div>
        <MissionFilters />
      </div>
      <div className="">
        {missionsComponents}
      </div>
    </div>
  );
}

function MissionFilters() {
  return (
    <FormControl>
      <RadioGroup
        row
        name="missions-radio-buttons-group"
      >
        <FormControlLabel value="Approved" control={<Radio />} label="To Review" />
        <FormControlLabel value="Ok" control={<Radio />} label="Finished" />
      </RadioGroup>
    </FormControl>
  );
}