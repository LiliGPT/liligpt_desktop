import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { WelcomeView } from "./features/welcome/WelcomeView";
import { selectCurrentProject, selectProjectDir } from "./redux/slices/currentProject";
import { CurrentProjectView } from "./features/editor/CurrentProjectView";
import { useAppSelector } from "./redux/hooks";
import { EditorView } from "./features/editor/EditorView";

function App() {
  return (
    <div className="h-screen w-screen bg-app-bg text-app-text">
      <Provider store={store}>
        <EditorView />
      </Provider>
    </div>
  );
}

export function InnerApp() {
  const projectDir = useAppSelector(selectProjectDir);
  let content;

  if (projectDir === '') {
    content = <WelcomeView />;
  } else {
    content = <EditorView />;
  }

  return content;
}

export default App;
