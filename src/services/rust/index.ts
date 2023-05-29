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

export interface TestScriptFromRust {
  [scriptName: string]: string;
}

export function rustGetTestScripts(projectDir: string): Promise<TestScriptFromRust> {
  // return invoke("get_test_scripts", { project_dir: projectDir });
  return new Promise((resolve, reject) => {
    const request = { projectDir };
    invoke("get_test_scripts", request).then(response => {
      console.log(`[rustGetTestScripts]`, { request, response })
      resolve(response as TestScriptFromRust);
    }).catch(error => {
      console.log(`[rustGetTestScripts]`, { request, error })
      reject(error);
    });
  });
}

export function rustRunShellCommand(cwd: string, command: string): Promise<string> {
  // return invoke("run_shell_command", { project_dir: cwd, command });
  return new Promise((resolve, reject) => {
    const request = { cwd, command };
    invoke("run_shell_command", request).then(response => {
      console.log(`[rustRunShellCommand]`, { request, response })
      resolve(response as string);
    }).catch(error => {
      console.log(`[rustRunShellCommand]`, { request, error })
      reject(error);
    });
  });
}

export function rustRunNpmScript(cwd: string, script_name: string, args: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = { cwd, script_name, args };
    invoke("run_npm_script", request).then(response => {
      console.log(`[rustRunNpmScript]`, { request, response })
      resolve(response as string);
    }).catch(error => {
      console.log(`[rustRunNpmScript]`, { request, error })
      reject(error);
    });
  });
}
