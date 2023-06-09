import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainAppLayout from "./features/layout/MainAppLayout";

function App() {
  return (
    <div className="h-screen w-screen bg-app-bg text-app-text">
      <Provider store={store}>
        <MainAppLayout />
      </Provider>
    </div>
  );
}

export default App;
