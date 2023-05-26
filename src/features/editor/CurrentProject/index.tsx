import { Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useAppSelector } from "../../redux/hooks";
import { selectProjectDir } from "../editorCurrentProjectSlice";

export default function CurrentProject() {
  const projectDir = useAppSelector(selectProjectDir);
  return (
    <div className="flex justify-center items-center h-screen">
      You selected this project: {projectDir}
    </div>
  );
}
