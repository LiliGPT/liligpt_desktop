export function MainAppSidebar() {
  return (
    <div>
      <SidebarItem label="Code Projects" />
      <SidebarItem label="Missions History" />
    </div>
  );
}

function SidebarItem({ label }: { label: string }) {
  return (
    <div className="flex flex-row items-center justify-between h-10 px-4 hover:bg-slate-500 text-sm font-bold cursor-pointer">
      <div className="text-white">{label}</div>
      <div className="text-white text-sm">&raquo;</div>
    </div>
  );
}
