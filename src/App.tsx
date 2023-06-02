import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { WelcomeView } from "./features/welcome/WelcomeView";
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

export default App;
