import PlayIcon from '@mui/icons-material/PlayArrow';
import DebugIcon from '@mui/icons-material/PlayCircle';
import StopIcon from '@mui/icons-material/Stop';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { OpenedLocalServer } from './OpenedLocalServer';
import { useState } from 'react';
import { ReduxShellTask, addShellTaskThunk, removeShellTaskThunk, selectShellTasksByProject } from '../../../redux/slices/shellTasksSlice';

interface Props {
  projectUid: string;
  commands: string[];
}

export function LocalServerBlockLayout({ projectUid, commands }: Props) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectShellTasksByProject(projectUid));

  const startLocalServer = (command: string) => {
    // dispatch(runLocalServerCommandThunk(name));
    const shellTask: ReduxShellTask = {
      projectUid,
      command,
      shellTaskUid: `${projectUid}-${command}`,
      isRunning: false,
    };
    dispatch(addShellTaskThunk(shellTask));
  };

  const stopLocalServer = (command: string) => {
    dispatch(removeShellTaskThunk(`${projectUid}-${command}`));
  };

  return (
    <div className="bg-slate-200 text-gray-900 border-slate-300 border text-sm p-2 pl-3 pb-3 rounded-md mb-3">
      <h2>Local Server</h2>

      {commands.map((command: string) => {
        const task: ReduxShellTask | undefined = tasks.find((task: ReduxShellTask) => task.command === command);
        const commandIsRunning = task?.isRunning ?? false;
        const statusMarker = commandIsRunning ? (
          <div className="w-2 h-2 rounded-full bg-green-600 inline-block mr-2"></div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-500 inline-block mr-2"></div>
        );
        const playButton = !commandIsRunning && (
          <span onClick={() => startLocalServer(command)}>
            <PlayIcon fontSize="small" />
          </span>
        );
        const stopButton = commandIsRunning && !!(task?.pid || 0 > 0) && (
          <span onClick={() => stopLocalServer(command)}>
            <StopIcon fontSize="small" />
          </span>
        );
        return (
          <div className="p-0.5" key={command}>
            {statusMarker}
            <span>{command}</span>
            {playButton} {stopButton}
          </div>
        );
      })}

      <OpenedLocalServer projectUid={projectUid} command={commands[0]} />
    </div>
  )
}