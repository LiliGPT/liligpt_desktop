import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectShellTasksByProject } from "../../../redux/slices/shellTasksSlice";
import { selectCurrentProject } from "../../../redux/slices/projectsSlice";
import { ReduxShellLog, selectShellLogsByShellTaskId } from "../../../redux/slices/shellLogsSlice";

interface Props {
  projectUid: string;
  command: string;
}

export function OpenedLocalServer({ projectUid, command }: Props) {
  const dispatch = useAppDispatch();
  const shellTasks = useAppSelector(selectShellTasksByProject(projectUid));
  const currentShellTask = shellTasks.find((shellTask) => shellTask.command === command);
  const logs = useAppSelector(selectShellLogsByShellTaskId(currentShellTask?.shellTaskUid ?? ''));
  const refScrollview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const schedule = setTimeout(() => {
      refScrollview.current?.scrollTo(0, refScrollview.current?.scrollHeight);
    }, 100);

    return () => {
      clearInterval(schedule);
    };
  }, [logs.length]);

  if (!logs.length) {
    return <></>;
  }

  return (
    <div className="p-2 bg-gray-400 h-96 overflow-y-auto" ref={refScrollview}>
      {logs.map((log: ReduxShellLog, index: number) => {
        return <div
          key={`${log.shellTaskUid}-${index}`}
          dangerouslySetInnerHTML={{ __html: log.message }}
        ></div>;
      })}
    </div>
  );
}
