import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack } from "@mui/material";

function App() {
  const [greetMsg, setGreetMsg] = useState("-");

  function openProject() {
    setGreetMsg("Opening project...");
    const onOpened = (filePath: any) => {
      setGreetMsg(`Project opened! ${JSON.stringify(filePath)}`);
    };
    invoke("open_project").then(res => onOpened(res)).catch(err => setGreetMsg(`Error: ${err}`));
  }

  return (
    <Stack alignItems="center">
      <Button variant="contained" onClick={openProject}>Open Project</Button>

      Result: {greetMsg}
    </Stack>
  );
}

export default App;
