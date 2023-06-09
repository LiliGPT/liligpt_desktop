import { shell } from "@tauri-apps/api";
import { rustRunShellCommand } from "./rust";

interface ShellSpawnProps {
  key: string;
  command: string;
  cwd: string;
  onStdout: (data: string) => void;
  onStderr: (data: string) => void;
  onError: (err: Error) => void;
  onExit: (code: number) => void;
}

type KillFunction = () => Promise<void>;

class ShellInstances {
  static _shellInstances: {
    [key: string]: KillFunction[];
  } = {};
}

const _shellInstances: {
  [key: string]: KillFunction[];
} = {};

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function shellSpawn({
  key,
  command,
  cwd,
  onStdout,
  onStderr,
  onError,
  onExit,
}: ShellSpawnProps): Promise<number> {
  if (!_shellInstances[key]) {
    _shellInstances[key] = [];
  }
  // command = "echo 'waiting...'; sleep 3; echo '3'; sleep 3; echo '6'; sleep 3; echo '9'; sleep 3; echo 'done';";
  // const cmd = new shell.Command('bash', ['-c', command, '&'], {
  //   cwd,
  //   encoding: 'utf-8',
  // });
  const cmd = new shell.Command('bash', [], {
    cwd,
    encoding: 'utf-8',
  });
  cmd.stdout.on('data', onStdout);
  cmd.stderr.on('data', onStderr);
  cmd.on('error', onError);
  cmd.on('close', onExit);
  const child = await cmd.spawn();
  child.write(`${command}\n`);
  // child.write(`echo $$ $PPID $!\n`);
  await delay(5000);
  // get the right pid
  let pid;
  try {
    pid = await rustRunShellCommand(cwd, `ps -ax | grep Sl+ | grep -v grep | awk '{print $1}' | tail -1`);
  } catch (err) {
    console.log(`[shellSpawn] pid error: ${err}`);
  }
  // console.log('pid ============ ', pid);
  // console.log(pid);
  if (!pid) {
    // throw new Error(`[shellSpawn] pid not found`);
    return 0;
  }
  return parseInt(pid);
  // setTimeout(async function __killChild(child: shell.Child) {
  //   await child.kill();
  // }.bind(null, child), 5000);
  // _shellInstances[key].push(() => child.kill());
}

export async function shellKill(pid: number): Promise<string> {
  const res = await rustRunShellCommand('/', `
    function kill_recursive {
      local parent_pid=$1
      local child_pids=$(pgrep -P "$parent_pid")
      for pid in $child_pids; do
          kill_recursive "$pid"
      done
      kill -9 "$parent_pid"
    }
    kill_recursive ${pid}
  `);
  return res;
}
