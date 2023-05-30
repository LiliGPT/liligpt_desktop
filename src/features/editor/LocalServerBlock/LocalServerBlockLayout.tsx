import ConfigIcon from '@mui/icons-material/Settings';
import PlayIcon from '@mui/icons-material/PlayArrow';
import DebugIcon from '@mui/icons-material/PlayCircle';
import StopIcon from '@mui/icons-material/Stop';
import { LocalServer, runLocalServerThunk, stopLocalServerThunk } from '../../../redux/slices/localServers';
import { useAppDispatch } from '../../../redux/hooks';

interface Props {
  servers: LocalServer[];
}

export function LocalServerBlockLayout({ servers }: Props) {
  const dispatch = useAppDispatch();

  const startLocalServer = (name: string) => {
    dispatch(runLocalServerThunk(name));
  };

  const stopLocalServer = (name: string) => {
    dispatch(stopLocalServerThunk(name));
  };

  return (
    <div className="relative bg-gray-200 text-gray-900 text-sm p-2 pl-3 pb-3 rounded-md mb-3">
      <div className="absolute right-2 top-1.5">
        <span onClick={() => { }}>
          <ConfigIcon fontSize='small' />
        </span>
      </div>
      <h2>Local Server</h2>

      {servers.map((server) => {
        const statusMarker = server.isRunning ? (
          <div className="w-2 h-2 rounded-full bg-green-600 inline-block mr-2"></div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-500 inline-block mr-2"></div>
        );
        const playButton = !server.isRunning && (
          <span onClick={() => startLocalServer(server.name)}>
            <PlayIcon />
          </span>
        );
        const stopButton = server.isRunning && (
          <span onClick={() => stopLocalServer(server.name)}>
            <StopIcon />
          </span>
        );
        return (
          <div className="py-2" key={server.name}>
            {statusMarker}
            <span className="font-semibold">{server.name}</span>
            {playButton} {stopButton}
          </div>
        );
      })}
    </div>
  )
}