import { Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useAppDispatch } from "../../redux/hooks";
import { openProjectThunk } from "../../redux/slices/currentProject";
import { message } from '@tauri-apps/api/dialog';
import { ProjectFromRust } from "../../services/rust";
import { shell } from "@tauri-apps/api";

// todo: refactor this
// todo: move this and the invoke to a dispatch


export function WelcomeView() {
  const dispatch = useAppDispatch();

  function onClickOpenProject() {
    dispatch(openProjectThunk());
  }

  // deleteme later
  function runTest() {
    function onStdout(data: string) {
      console.log(`stdout: ${data}`);
    }
    function onStderr(data: string) {
      console.log(`stderr: ${data}`);
    }
    function onExit(code: number) {
      console.log(`child process exited with code ${code}`);
    }
    const cmd = new shell.Command('bash', ['-c', 'npm start'], {
      cwd: '/home/l/sample-projects/nestjs-example-project',
      encoding: 'utf-8',
    });
    cmd.stdout.on('data', onStdout);
    cmd.stderr.on('data', onStderr);
    cmd.on('error', (err) => {
      console.log(`cmd error: `, err);
    });
    cmd.on('close', onExit);
    cmd.spawn();
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

      <button
        className="bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 text-gray-700 font-bold py-1 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        onClick={runTest}
      >
        Run shell test
      </button>
    </div>
  );
}