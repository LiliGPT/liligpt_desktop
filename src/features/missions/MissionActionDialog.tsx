import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ReduxMissionAction } from "../../redux/slices/missionsSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  action: ReduxMissionAction | null;
}

export function MissionActionDialog(props: Props) {
  const { open, onClose, action } = props;
  let dialogContent;

  if (action) {
    dialogContent = (
      <>
        <DialogTitle>Visualizar arquivo: {action.path}</DialogTitle>
        <DialogContent>
          <pre className="p-2 border border-slate-900 bg-slate-800 text-gray-300 text-xs overflow-auto h-96">
            {action.content}
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