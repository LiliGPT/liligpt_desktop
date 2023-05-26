import { FileSystemTree } from "../FileSystemTree";

export function CurrentProjectSidebar() {
  return (
    <div className="p-2 h-screen">
      sidebar:
      <FileSystemTree />
    </div>
  );
}