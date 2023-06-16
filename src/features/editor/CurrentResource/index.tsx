import { ResourceSidebar } from "./ResourceSidebar";
import { ProjectOverview } from "./ProjectOverview";

type Props = {
  onClickConfigButton: () => void;
};

export function CurrentResource({ onClickConfigButton }: Props) {
  // const projectDir = useAppSelector(selectProjectDir);
  // const message = `You selected this project: ${projectDir}`;
  return (
    <div className="flex items-stretch flex-col">
      <div className="flex flex-row">
        <div className="flex flex-col w-4/6">
          <div className="flex flex-row">
            <ProjectOverview />
          </div>
        </div>
        <div className="flex flex-col w-2/6">
          <ResourceSidebar />
        </div>
      </div>
    </div >
  );
}
