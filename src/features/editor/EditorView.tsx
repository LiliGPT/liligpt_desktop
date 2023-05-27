import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectProjectDir } from "../../redux/slices/currentProject";
import { WelcomeView } from "../welcome/WelcomeView";
import { CurrentProjectView } from "./CurrentProjectView";
import { ProjectSettingsView } from "./ProjectSettingsView";

enum EditorScreen {
  Overview,
  Settings,
}

export function EditorView() {
  // const projectDir = useAppSelector(selectProjectDir);
  const [screen, setScreen] = useState(EditorScreen.Overview);

  const openSettings = () => setScreen(EditorScreen.Settings);
  const openOverview = () => setScreen(EditorScreen.Overview);

  if (screen === EditorScreen.Overview) {
    return <CurrentProjectView onClickConfigButton={openSettings} />;
  }

  if (screen === EditorScreen.Settings) {
    return <ProjectSettingsView
      onClickCloseButton={openOverview}
    />;
  }

  return <></>;
}