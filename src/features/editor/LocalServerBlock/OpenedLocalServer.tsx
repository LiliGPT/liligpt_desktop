import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { LocalServer, LocalServerLogBlock, selectOpenedLocalServer } from "../../../redux/slices/localServers";

export function OpenedLocalServer() {
  const dispatch = useAppDispatch();
  const localServer: LocalServer | undefined = useAppSelector(selectOpenedLocalServer);
  const refScrollview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const schedule = setTimeout(() => {
      refScrollview.current?.scrollTo(0, refScrollview.current?.scrollHeight);
    }, 100);

    return () => {
      clearInterval(schedule);
    };
  }, [localServer?.logs.length]);

  if (!localServer) {
    return <></>;
  }

  return (
    <div className="p-2 bg-gray-400 h-96 overflow-y-auto" ref={refScrollview}>
      {localServer.logs.map((log: LocalServerLogBlock) => {
        return <div>{log.message}</div>;
      })}
    </div>
  );
}
