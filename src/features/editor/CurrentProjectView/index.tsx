import { Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useAppSelector } from "../../../redux/hooks";
import { selectProjectDir } from "../../../redux/slices/currentProject";
import { ProjectSidebar } from "./ProjectSidebar";
import { ProjectOverview } from "./ProjectOverview";
import ConfigIcon from '@mui/icons-material/Settings';

type Props = {
  onClickConfigButton: () => void;
};

export function CurrentProjectView({ onClickConfigButton }: Props) {
  // const projectDir = useAppSelector(selectProjectDir);
  // const message = `You selected this project: ${projectDir}`;
  return (
    <div className="flex items-stretch flex-col">
      <div className="flex flex-row">
        <div className="flex flex-col w-2/6">
          <ProjectSidebar />
        </div>
        <div className="flex flex-col w-4/6">
          <div className="flex flex-row relative">
            <div className="absolute right-2 top-2">
              <span onClick={onClickConfigButton}>
                <ConfigIcon />
              </span>
            </div>
            <ProjectOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
