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
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Pick a project to start working on!</h1>
      <button
        className="bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 text-gray-700 font-bold py-1 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        onClick={onClickOpenProject}
      >
        Open Project
      </button>
    </div>
  );
}