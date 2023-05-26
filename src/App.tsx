import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack } from "@mui/material";
import { Provider, useSelector } from "react-redux";
import { store } from "./features/redux/store";
import WelcomeContent from "./features/welcome/WelcomeContent";
import { selectProjectDir } from "./features/editor/editorCurrentProjectSlice";
import CurrentProject from "./features/editor/CurrentProject";
import { useAppSelector } from "./features/redux/hooks";

function App() {
  console.log('HELLO THERE!'); // TODO: this console.log is not working
  return (
    <Provider store={store}>
      <InnerApp />
    </Provider>
  );
}

function InnerApp() {
  const projectDir = useSelector(selectProjectDir);
  let content;

  if (projectDir === '') {
    content = <WelcomeContent />;
  } else {
    content = <CurrentProject />;
  }

  return content;
}

export default App;
