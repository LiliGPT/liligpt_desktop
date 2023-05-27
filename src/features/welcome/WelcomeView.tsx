import { Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useAppDispatch } from "../../redux/hooks";
import { openProjectThunk, setProjectDir } from "../../redux/slices/currentProject";
import { message } from '@tauri-apps/api/dialog';
import { ProjectFromRust } from "../../services/rust";

// todo: refactor this
// todo: move this and the invoke to a dispatch


export function WelcomeView() {
  const dispatch = useAppDispatch();

  function onClickOpenProject() {
    dispatch(openProjectThunk());
    return;
    const onOpened = (project: ProjectFromRust) => {
      // alert(`You selected this project: ${JSON.stringify(project)}`);
      // 
      // --------------------------------------------------------------------
      // todo next: Dispatch all info to redux, than display in the screen
      // rust now returns: { project_dir, code_language, framework }
      dispatch(setProjectDir(project.project_dir));
      // --------------------------------------------------------------------
    };
    invoke("open_project").then(res => onOpened(res as ProjectFromRust)).catch(err => {
      dispatch(setProjectDir(''));
      message(`Error opening project: ${err}`, {
        title: 'Error opening project',
        type: 'error',
        okLabel: 'Allright...',
      });
    });
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Button variant="contained" onClick={onClickOpenProject}>Open Project</Button>
      Pick a project to start working on!
    </div>
  );
}