import { Person } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import { ReduxCoreView, setCoreView } from "../../redux/slices/coreSlice";

interface Props {
  active: ReduxCoreView;
}

export function MainAppSidebar({ active }: Props) {
  return (
    <div className="relative h-screen">
      <SidebarItem
        label="Code Projects"
        active={active === ReduxCoreView.CodeProjects}
        view={ReduxCoreView.CodeProjects}
      />
      <SidebarItem
        label="Missions History"
        active={active === ReduxCoreView.MissionsHistory}
        view={ReduxCoreView.MissionsHistory}
      />
      <CurrentSidebarUser />
    </div>
  );
}

interface ItemProps {
  label: string;
  active: boolean;
  view: ReduxCoreView;
}

function SidebarItem({ label, active, view }: ItemProps) {
  const dispatch = useAppDispatch();
  const innerClasses = active ? "bg-slate-500" : "hover:bg-slate-600";

  const onClickItem = () => {
    dispatch(setCoreView(view));
  };

  return (
    <div
      className={`flex flex-row items-center justify-between h-10 px-4 border-b-2 border-b-slate-700 text-sm font-bold cursor-pointer ${innerClasses}`}
      onClick={onClickItem}
    >
      <div className="text-white">{label}</div>
      <div className="text-white text-sm">&raquo;</div>
    </div>
  );
}

function CurrentSidebarUser() {
  const user = useAppSelector(selectCurrentUser());

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white hover:bg-slate-500 text-sm cursor-pointer">
      <Person fontSize="small" />
      <span className="pl-1 inline-block align-middle">
        {user?.name}
      </span>
    </div>
  );
}
