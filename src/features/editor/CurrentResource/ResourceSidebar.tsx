import { Button } from "@mui/material";
import { FileSystemTree } from "../FileSystemTree";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ReduxProject, selectCurrentProject } from "../../../redux/slices/projectsSlice";

export function ResourceSidebar() {
  const dispatch = useAppDispatch();
  const project: ReduxProject | undefined = useAppSelector(selectCurrentProject());
  const subprojects = project?.subprojects ?? [];

  if (!project) {
    return <></>;
  }

  return (
    <div className="p-2 h-screen">
      {/*<FileSystemTree />*/}
      <h3 className="text-md">{project?.displayName}</h3>
      <Button
        onClick={() => { }}
        variant="contained"
        color="info"
        className="w-full"
      >
        {project!.displayName}
      </Button>
      {subprojects.map((subproject) => {
        return (
          <Button
            key={subproject.path}
            onClick={() => { }}
            variant="contained"
            color="info"
            className="w-full"
          >
            {subproject.name}
          </Button>
        );
      })}
    </div>
  );
}