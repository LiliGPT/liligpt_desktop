import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainAppLayout from "./features/layout/MainAppLayout";
import { CustomAuthProvider } from "./features/auth/CustomAuthProvider";

function App() {
  return (
    <div className="h-screen w-screen bg-app-bg text-app-text">
      <Provider store={store}>
        <CustomAuthProvider>
          <MainAppLayout />
        </CustomAuthProvider>
      </Provider>
    </div>
  );
}

export default App;
