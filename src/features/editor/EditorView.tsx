import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { WelcomeView } from "../welcome/WelcomeView";
import { CurrentResource } from "./CurrentResource";
import { ResourceSettings } from "./ResourceSettings";
import EditorTabs from "./EditorTabs";
import { selectCurrentProjectDir } from "../../redux/slices/projectsSlice";

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
    if (!useAppSelector(selectCurrentProjectDir())) {
      return <WelcomeView />;
    }
    return <>
      <EditorTabs />
      <CurrentResource onClickConfigButton={openSettings} />
    </>;
  }

  if (screen === EditorScreen.Settings) {
    return <ResourceSettings
      onClickCloseButton={openOverview}
    />;
  }

  return <></>;
}
