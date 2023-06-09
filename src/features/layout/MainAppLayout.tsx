import { useAppSelector } from "../../redux/hooks";
import { ReduxCoreView, selectCoreView } from "../../redux/slices/coreSlice";
import { EditorView } from "../editor/EditorView";
import { MissionsView } from "../missions/MIssionsView";
import { MainAppSidebar } from "./MainAppSidebar";

function MainAppLayout() {
  const coreView = useAppSelector(selectCoreView);

  return (
    <div className="h-screen w-screen bg-app-bg text-app-text">
      <div className="flex flex-row h-screen">
        <div className="w-52 bg-slate-700 flex-none">
          <MainAppSidebar active={coreView} />
        </div>
        <div className="flex-auto overflow-y-auto overflow-x-hidden">
          <MainView />
        </div>
      </div>
    </div>
  );
}

function MainView() {
  const coreView = useAppSelector(selectCoreView);

  switch (coreView) {
    case ReduxCoreView.CodeProjects:
      return <EditorView />;
    case ReduxCoreView.MissionsHistory:
      return <MissionsView />;
    default:
      return <></>;
  }
}

export default MainAppLayout;
