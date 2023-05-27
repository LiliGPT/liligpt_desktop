import { invoke } from "@tauri-apps/api/tauri";

export interface ProjectFromRust {
  project_dir: string;
  code_language: string;
  framework: string;
}

export function rustOpenProject(): Promise<ProjectFromRust> {
  // return invoke("open_project", {});
  return new Promise((resolve, reject) => {
    const request = {};
    invoke("open_project", request).then(response => {
      console.log(`[rustOpenProject]`, { request, response })
      resolve(response as ProjectFromRust);
    }).catch(error => {
      console.log(`[rustOpenProject]`, { request, error })
      reject(error);
    });
  });
}

export interface RenderTree {
  id: string;
  name: string;
  children?: readonly RenderTree[];
}

export type OptionalRenderTree = RenderTree | undefined;

export function rustGetFileTree(projectDir: string): Promise<RenderTree> {
  // return invoke("get_file_tree", { project_dir: projectDir });
  return new Promise((resolve, reject) => {
    const request = { projectDir };
    invoke("get_file_tree", request).then(response => {
      console.log(`[rustGetFileTree]`, { request, response })
      resolve(response as RenderTree);
    }).catch(error => {
      console.log(`[rustGetFileTree]`, { request, error })
      reject(error);
    });
  });
}
