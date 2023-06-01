import { useAppSelector } from "../../../redux/hooks";
import { selectCurrentProject } from "../../../redux/slices/projectsSlice";
import { LocalServerBlockLayout } from "./LocalServerBlockLayout";

export function LocalServerBlock() {
  const project = useAppSelector(selectCurrentProject());
  const commands = project?.localServerCommands;

  if (!project || !commands) {
    return <></>;
  }

  return <LocalServerBlockLayout
    projectUid={project.projectUid}
    commands={commands}
  />;
}