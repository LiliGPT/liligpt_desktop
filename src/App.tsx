import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./features/redux/store";
import WelcomeContent from "./features/welcome/WelcomeContent";
import { selectEditorCurrentProject, selectProjectDir } from "./features/editor/slice";
import { CurrentProjectPage } from "./features/editor/CurrentProject/page";
import { useAppSelector } from "./features/redux/hooks";

function App() {
  console.log('HELLO THERE!'); // TODO: this console.log is not working
  return (
    <div className="h-screen w-screen">
      <Provider store={store}>
        <InnerApp />
      </Provider>
    </div>
  );
}

function InnerApp() {
  const projectDir = useAppSelector(selectProjectDir);
  let content;

  if (projectDir === '') {
    content = <WelcomeContent />;
  } else {
    content = <CurrentProjectPage />;
  }

  return content;
}

export default App;
