import { Button } from "@mui/material";
import { FileSystemTree } from "../FileSystemTree";
import { useAppDispatch } from "../../../redux/hooks";

export function ResourceSidebar() {
  const dispatch = useAppDispatch();

  return (
    <div className="p-2 h-screen">
      <div className="flex flex-col space-y-2">
        todo
      </div>
      {/*<FileSystemTree />*/}
    </div>
  );
}