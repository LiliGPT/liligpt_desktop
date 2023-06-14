import { InvokeArgs, invoke } from "@tauri-apps/api/tauri";
import { CodeMission, MissionAction, MissionExecution, SearchExecutionsRequest } from "./rust";

export interface SubprojectFromRust {
  name: string;
  path: string;
  code_language: string;
  framework: string;
}

export interface ProjectFromRust {
  project_dir: string;
  code_language: string;
  framework: string;
  dependencies_installed: boolean;
  local_server_commands: string[];
  subprojects: SubprojectFromRust[];
}

export function rustOpenProject(path?: string): Promise<ProjectFromRust> {
  // return invoke("open_project", {});
  return new Promise((resolve, reject) => {
    const request = { path: path ?? '' };
    invoke("open_project", request).then(response => {
      console.log(`[rustOpenProject]`, { request, response });
      resolve(response as ProjectFromRust);
    }).catch(error => {
      console.log(`[rustOpenProject]`, { request, error });
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
      console.log(`[rustGetFileTree]`, { request, response });
      resolve(response as RenderTree);
    }).catch(error => {
      console.log(`[rustGetFileTree]`, { request, error });
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
      console.log(`[rustGetTestScripts]`, { request, response });
      resolve(response as TestScriptFromRust);
    }).catch(error => {
      console.log(`[rustGetTestScripts]`, { request, error });
      reject(error);
    });
  });
}

export function rustRunShellCommand(cwd: string, command: string): Promise<string> {
  // return invoke("run_shell_command", { project_dir: cwd, command });
  return new Promise((resolve, reject) => {
    const request = { cwd, command };
    invoke("run_shell_command", request).then(response => {
      console.log(`[rustRunShellCommand]`, { request, response });
      resolve(response as string);
    }).catch(error => {
      console.log(`[rustRunShellCommand]`, { request, error });
      reject(error);
    });
  });
}

export function rustInstallDependencies(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = { cwd };
    invoke("install_dependencies", request).then(response => {
      console.log(`[rustInstallDependencies]`, { request, response });
      resolve();
    }).catch(error => {
      console.log(`[rustInstallDependencies]`, { request, error });
      reject(error);
    });
  });
}

//////////////////////////////////////////////////////////////////////////////////////////
// Prompter

export interface PreparedPromptFromRust {
  prompt_request_id: string;
  message: string;
  code_language: string;
  framework: string;
  files: {
    can_create: boolean;
    can_read: boolean;
    context: PromptContextFile[];
  };
}
export interface PromptResponseFromRust extends CodeMission {
  // prompt_id: string;
  // status: string; // Ok
  // actions: PromptAction[],
}
interface Mission extends PromptResponseFromRust { }

interface PromptContextFile {
  path: string;
  content: string | null;
}
interface PromptAction {
  action_type: string; // create_file | update_file
  content: string | null;
  path: string;
}

export async function rustPromptPrepare(projectDir: string, message: string): Promise<PreparedPromptFromRust> {
  return new Promise((resolve, reject) => {
    const request = { path: projectDir, message };
    invoke("rust_prompt_prepare", request).then(response => {
      console.log(`[rustPromptPrepare]`, { request, response });
      resolve(response as PreparedPromptFromRust);
    }).catch(error => {
      console.log(`[rustPromptPrepare]`, { request, error });
      reject(error);
    });
  });
};

export async function rustPromptCreate(projectDir: string, prompt: PreparedPromptFromRust): Promise<PromptResponseFromRust> {
  return new Promise((resolve, reject) => {
    const request = { path: projectDir, prompt };
    invoke("rust_prompt_create", request).then(response => {
      console.log(`[rustPromptCreate]`, { request, response });
      resolve(response as PromptResponseFromRust);
    }).catch(error => {
      console.log(`[rustPromptCreate]`, { request, error });
      reject(error);
    });
  });
};

export async function rustPromptApproveAndRun(projectDir: string, promptId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = { path: projectDir, promptId };
    invoke("rust_prompt_approve_and_run", request).then(response => {
      console.log(`[rustPromptApproveAndRun]`, { request, response });
      resolve();
    }).catch(error => {
      console.log(`[rustPromptApproveAndRun]`, { request, error });
      reject(error);
    });
  });
};

export async function rustPromptDelete(promptId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = { promptId };
    invoke("rust_prompt_delete", request).then(response => {
      console.log(`[rustPromptDelete]`, { request, response });
      resolve();
    }).catch(error => {
      console.log(`[rustPromptDelete]`, { request, error });
      reject(error);
    });
  });
};

export async function rustPromptSetOk(promptId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = { promptId };
    invoke("rust_prompt_set_ok", request).then(response => {
      console.log(`[rustPromptDelete]`, { request, response });
      resolve();
    }).catch(error => {
      console.log(`[rustPromptDelete]`, { request, error });
      reject(error);
    });
  });
};

export async function rustPromptSubmitReview(projectDir: string, promptId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = { promptId, cwd: projectDir };
    invoke("rust_prompt_submit_review", request).then(response => {
      console.log(`[rustPromptSubmitReview]`, { request, response });
      resolve();
    }).catch(error => {
      console.log(`[rustPromptSubmitReview]`, { request, error });
      reject(error);
    });
  });
}

export async function rustFetchMissions(): Promise<CodeMission[]> {
  return new Promise((resolve, reject) => {
    const request = {};
    invoke("fetch_missions", request).then(response => {
      console.log(`[rustFetchMissions]`, { request, response });
      resolve(response as CodeMission[]);
    }).catch(error => {
      console.log(`[rustFetchMissions]`, { request, error });
      reject(error);
    });
  });
}

export async function rustReplaceMissionActions(promptId: string, actions: MissionAction[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = { promptId, actions };
    invoke("rust_prompt_replace_actions", request).then(response => {
      console.log(`[rustReplaceMissionActions]`, { request, response });
      resolve();
    }).catch(error => {
      console.log(`[rustReplaceMissionActions]`, { request, error });
      reject(error);
    });
  });
}

// --- New commands

export async function rustSearchExecutions(request: SearchExecutionsRequest): Promise<MissionExecution[]> {
  return new Promise((resolve, reject) => {
    invoke("search_executions_command", { request }).then(response => {
      console.log(`[rustSearchExecutions]`, { request, response });
      resolve(response as MissionExecution[]);
    }).catch(error => {
      console.log(`[rustSearchExecutions]`, { request, error });
      reject(error);
    });
  });
}
