import { Button } from "@mui/material";
import { FileSystemTree } from "../FileSystemTree";
import { useAppDispatch } from "../../../redux/hooks";
import { closeCurrentProjectThunk, openProjectThunk } from "../../../redux/slices/currentProject";

export function ProjectSidebar() {
  const dispatch = useAppDispatch();
  const onCloseProject = () => {
    dispatch(closeCurrentProjectThunk());
  };

  const onClickOpenProject = () => {
    dispatch(closeCurrentProjectThunk());
    setTimeout(() => {
      dispatch(openProjectThunk());
    }, 500);
  };

  return (
    <div className="p-2 h-screen">
      <div className="flex flex-col space-y-2">
        <Button variant="text" color="primary" onClick={onCloseProject}>close project</Button>
        <Button variant="text" color="primary" onClick={onClickOpenProject}>open project</Button>
      </div>
      {/*<FileSystemTree />*/}
    </div>
  );
}