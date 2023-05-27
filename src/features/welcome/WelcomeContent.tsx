import { Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useAppDispatch } from "../redux/hooks";
import { setProjectDir } from "../redux/slices/currentProject";
import { message } from '@tauri-apps/api/dialog';

export default function WelcomeContent() {
  const dispatch = useAppDispatch();

  function openProject() {
    const onOpened = (projectDir: string) => {
      dispatch(setProjectDir(projectDir));
    };
    invoke("open_project").then(res => onOpened(res as string)).catch(err => {
      console.log('TODO: handle open_project error', err);
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
      <Button variant="contained" onClick={openProject}>Open Project</Button>
      Pick a project to start working on!
    </div>
  );
}