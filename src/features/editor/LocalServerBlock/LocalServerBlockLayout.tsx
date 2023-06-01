import ConfigIcon from '@mui/icons-material/Settings';
import PlayIcon from '@mui/icons-material/PlayArrow';
import DebugIcon from '@mui/icons-material/PlayCircle';
import StopIcon from '@mui/icons-material/Stop';
import { useAppDispatch } from '../../../redux/hooks';
import { OpenedLocalServer } from './OpenedLocalServer';
import { useState } from 'react';
import { ReduxShellTask, addShellTaskThunk, removeShellTaskThunk } from '../../../redux/slices/shellTasksSlice';

interface Props {
  projectUid: string;
  commands: string[];
}

export function LocalServerBlockLayout({ projectUid, commands }: Props) {
  const [currentCommand, setCurrentCommand] = useState<string>('');

  const dispatch = useAppDispatch();

  const startLocalServer = (command: string) => {
    // dispatch(runLocalServerCommandThunk(name));
    setCurrentCommand(command);
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
    setCurrentCommand('');
  };

  return (
    <div className="relative bg-gray-200 text-gray-900 text-sm p-2 pl-3 pb-3 rounded-md mb-3">
      <div className="absolute right-2 top-1.5">
        <span onClick={() => { }}>
          <ConfigIcon fontSize='small' />
        </span>
      </div>
      <h2>Local Server</h2>

      {commands.map((command: string) => {
        const commandIsRunning = currentCommand === command;
        const statusMarker = commandIsRunning ? (
          <div className="w-2 h-2 rounded-full bg-green-600 inline-block mr-2"></div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-500 inline-block mr-2"></div>
        );
        const playButton = !commandIsRunning && (
          <span onClick={() => startLocalServer(command)}>
            <PlayIcon />
          </span>
        );
        const stopButton = commandIsRunning && (
          <span onClick={() => stopLocalServer(command)}>
            <StopIcon />
          </span>
        );
        return (
          <div className="py-2" key={command}>
            {statusMarker}
            <span className="font-semibold">{command}</span>
            {playButton} {stopButton}
          </div>
        );
      })}

      <OpenedLocalServer projectUid={projectUid} command={currentCommand} />
    </div>
  )
}