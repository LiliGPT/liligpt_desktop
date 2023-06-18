import { TextField } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectCurrentProject } from "../../../redux/slices/projectsSlice";

interface Props {
  onSubmit: () => void;
  value: string;
  buttonLabel: string;
  onChange: (message: string) => void;
  disabled: boolean;
}

export function MissionInput({ value, onChange, onSubmit, disabled, buttonLabel }: Props) {
  const onClickAskButton = () => {
    onSubmit();
  };

  return (
    <div className="flex flex-row w-full">
      <div className="flex-auto">
        <TextField disabled={disabled} label="Mission" value={value} onChange={(e) => onChange(e.target.value)} fullWidth multiline maxRows={4} />
      </div>
      <div>
        {!disabled && <button
          className="px-2 py-1 text-sm bg-slate-300 hover:bg-slate-400 rounded h-full"
          onClick={onClickAskButton}
        >
          {buttonLabel}
        </button>}
      </div>
    </div>
  );
}