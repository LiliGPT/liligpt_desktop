import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MissionAction, MissionExecutionContextFile } from "../../services/rust/rust";
import { CustomButton } from "../buttons/CustomButton";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  action: MissionAction | null;
  contextFiles: MissionExecutionContextFile[];
}

export function MissionActionDialog(props: Props) {
  const { open, onClose, action, contextFiles } = props;
  const [showOriginal, setShowOriginal] = useState(false);
  let dialogContent;
  let buttonsContent;

  useEffect(() => {
    setShowOriginal(false);
  }, [action]);

  const findOriginalFile = (path: string) => {
    const file = contextFiles.find(file => file.path === path);
    if (file) {
      return file;
    }
    return null;
  };

  let originalFile = action ? findOriginalFile(action.path) : null;
  buttonsContent = (
    <div className="mb-2">
      {!!originalFile && (<CustomButton
        color={showOriginal ? "highlight" : "normal"}
        size="small"
        label="Original"
        onClick={() => setShowOriginal(true)}
      />)}
      <CustomButton
        color={showOriginal ? "normal" : "highlight"}
        size="small"
        label="Modified"
        onClick={() => setShowOriginal(false)}
      />
    </div>
  );

  if (action) {
    let actionContent = showOriginal && originalFile?.content ? originalFile.content : action.content;
    dialogContent = (
      <>
        <DialogTitle>Visualizar arquivo: {action.path}</DialogTitle>
        <DialogContent>
          {buttonsContent}
          <pre className="p-2 border border-slate-900 bg-slate-800 text-gray-300 text-xs overflow-auto h-96">
            {actionContent}
          </pre>
        </DialogContent>
      </>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      {dialogContent}
    </Dialog>
  );
}