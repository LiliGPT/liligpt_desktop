import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchExecutionsThunk, selectExecutions } from "../../redux/slices/missionsSlice";
import { MissionItem } from "./MissionItem";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { MissionExecution } from "../../services/rust/rust";

export function MissionsView() {
  const dispatch = useAppDispatch();
  const executions = useAppSelector(selectExecutions);

  useEffect(() => {
    dispatch(fetchExecutionsThunk());
  }, []);

  const executionsComponents = executions.map((mission: MissionExecution) => <MissionItem key={mission.mission_id} {...mission} />);

  return (
    <div className="p-2 max-w-2xl">
      <h1>Missions History</h1>
      <div>
        <MissionFilters />
      </div>
      <div className="">
        {executionsComponents}
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