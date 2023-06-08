import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { openProjectThunk } from "../../redux/slices/projectsSlice";
import { ProjectFromRust, rustPromptSubmitReview } from "../../services/rust";
import { invoke } from "@tauri-apps/api";

const ENABLE_INITIAL_DISPATCHER = false;

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// this function was created to start the app in a desired state
function _InitialDispatcher() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function run() {
      const project: ProjectFromRust = {
        code_language: 'NodeTs',
        framework: 'NodeNest',
        dependencies_installed: true,
        local_server_commands: ['npm run start:dev'],
        project_dir: '/home/l/sample-projects/nestjs-example-project',
        subprojects: [],
      };
      // open the project
      // await dispatch(openProjectThunk(project));
    }
    run();
  }, []);
  return <></>;
}

export function WelcomeView() {
  const dispatch = useAppDispatch();

  function onClickOpenProject() {
    dispatch(openProjectThunk());
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

      {ENABLE_INITIAL_DISPATCHER && <_InitialDispatcher />}
    </div>
  );
}
