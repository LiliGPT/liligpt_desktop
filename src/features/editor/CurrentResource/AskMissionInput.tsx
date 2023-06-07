import { TextField } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectCurrentProject } from "../../../redux/slices/projectsSlice";

export function AskMissionInput() {
  const project = useAppSelector(selectCurrentProject());
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const onClickAskButton = async () => {
    // prepare message for the mission
    // const prompt = rustPreparePrompt(message);
  };

  const onClose = () => setOpen(false);

  return (
    <div className="flex flex-row">
      <div className="flex-auto">
        <TextField label="Mission" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth multiline maxRows={4} />
      </div>
      <div>
        <button
          className="px-2 py-1 text-sm bg-slate-300 hover:bg-slate-400 rounded h-full"
          onClick={onClickAskButton}
        >
          Ask
        </button>
      </div>
    </div>
  );
}