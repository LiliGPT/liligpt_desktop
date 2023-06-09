import { EditorView } from "../editor/EditorView";
import { MainAppSidebar } from "./MainAppSidebar";

function MainAppLayout() {
  return (
    <div className="h-screen w-screen bg-app-bg text-app-text">
      <div className="flex flex-row h-screen">
        <div className="w-52 bg-slate-700">
          <MainAppSidebar />
        </div>
        <div className="flex-auto">
          <EditorView />
        </div>
      </div>
    </div>
  );
}

export default MainAppLayout;
