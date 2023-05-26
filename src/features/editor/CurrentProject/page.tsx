import { Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useAppSelector } from "../../redux/hooks";
import { selectProjectDir } from "../editorCurrentProjectSlice";
import { CurrentProjectSidebar } from "./Sidebar";

export function CurrentProjectPage() {
  const projectDir = useAppSelector(selectProjectDir);
  const message = `You selected this project: ${projectDir}`;
  // this function returns a
  // layout with two columns
  // this is a tailwind react component
  return (
    <div className="flex items-stretch flex-col h-screen">
      <div className="flex items-stretch flex-row h-screen">
        <div className="flex flex-col w-2/6">
          <CurrentProjectSidebar />
        </div>
        <div className="flex flex-col w-4/6">
          <div className="flex flex-row">
            <Button variant="contained" onClick={() => invoke("new_scene")}>
              New Scene
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
