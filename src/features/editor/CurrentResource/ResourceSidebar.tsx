import { Button } from "@mui/material";
import { FileSystemTree } from "../FileSystemTree";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ReduxProject, ReduxSubproject, openSubprojectThunk, selectCurrentProject, selectCurrentProjectParent, setOpenedProjectUid } from "../../../redux/slices/projectsSlice";

export function ResourceSidebar() {
  const dispatch = useAppDispatch();
  const project: ReduxProject | undefined = useAppSelector(selectCurrentProject());
  const parentProject: ReduxProject | undefined = useAppSelector(selectCurrentProjectParent());
  const openedProjectUid = useAppSelector((state) => state.projects.openedProjectUid);
  const rootProject = parentProject ?? project;
  const subprojects = rootProject?.subprojects ?? [];

  const onClickSubproject = (subproject: ReduxSubproject) => {
    dispatch(openSubprojectThunk(project!.projectUid, subproject.path));
  };

  if (!project || !subprojects.length) {
    return <></>;
  }

  if (project) {
    return <>
      {/*<FileSystemTree />*/}
    </>;
  }

  return (
    <div className="p-2 h-screen">
      <RootProjectItem
        onClick={() => dispatch(setOpenedProjectUid(rootProject!.projectUid))}
        active={openedProjectUid === rootProject!.projectUid}
      >
        {rootProject!.displayName}
      </RootProjectItem>
      {subprojects.map((subproject) => {
        return (
          <SubprojectItem
            key={subproject.path}
            onClick={() => onClickSubproject(subproject)}
            active={openedProjectUid === subproject.path}
          >
            {subproject.name}
          </SubprojectItem>
        );
      })}
    </div>
  );
}

function RootProjectItem({ children, active, onClick }: { children: string, active: boolean, onClick: () => void }) {
  let className = "py-1 px-2 bg-gray-200 rounded-md cursor-pointer hover:bg-slate-300";
  if (active) {
    className += " bg-slate-300";
  }
  return (
    <div className={className} onClick={onClick}>
      <span className="text-md">{children}</span>
    </div>
  );
}

function SubprojectItem({ children, active, onClick }: { children: string, active: boolean, onClick: () => void }) {
  let className = "ml-4 mt-1 py-1 px-2 bg-gray-200 rounded-md cursor-pointer hover:bg-slate-300";
  if (active) {
    className += " bg-slate-300";
  }
  return (
    <div className={className} onClick={onClick}>
      <span className="text-md">{children}</span>
    </div>
  );
}