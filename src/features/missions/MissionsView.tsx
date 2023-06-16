import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchExecutionsThunk, selectExecutions } from "../../redux/slices/missionsSlice";
import { MissionItem } from "./MissionItem";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { MissionExecution } from "../../services/rust/rust";
import { MainAppTitle } from "../layout/MainAppTitle";

export function MissionsView() {
  const dispatch = useAppDispatch();
  const executions = useAppSelector(selectExecutions);

  useEffect(() => {
    dispatch(fetchExecutionsThunk());
  }, []);

  const executionsComponents = executions.map((mission: MissionExecution) => <MissionItem key={mission.execution_id} {...mission} />);

  return (
    <>
      <MainAppTitle title="Missions History" />
      <div className="p-2 w-4/6">
        <div className="">
          {executionsComponents}
        </div>
      </div >
    </>
  );
}
