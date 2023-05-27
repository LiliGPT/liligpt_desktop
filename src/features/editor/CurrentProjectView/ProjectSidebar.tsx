import { FileSystemTree } from "../FileSystemTree";

export function ProjectSidebar() {
  return (
    <div className="p-2 h-screen">
      sidebar:
      <FileSystemTree />
    </div>
  );
}