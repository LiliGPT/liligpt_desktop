import { Button } from "@mui/material";
import { FileSystemTree } from "../FileSystemTree";
import { useAppDispatch } from "../../../redux/hooks";
import { closeCurrentProject } from "../../../redux/slices/currentProject";

export function ProjectSidebar() {
  const dispatch = useAppDispatch();
  const onCloseProject = () => {
    dispatch(closeCurrentProject());
  };

  return (
    <div className="p-2 h-screen">
      sidebar:
      <Button variant="text" color="primary" onClick={onCloseProject}>close</Button>
      <FileSystemTree />
    </div>
  );
}