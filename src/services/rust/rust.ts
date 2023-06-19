// --- General

export enum CodeLanguage {
  Javascript = 'Javascript',
  Rust = 'Rust',
}

export enum Framework {
  NodeNest = 'NodeNest',
}

export interface CodeMission {
  mission_id: string,
  mission_status: CodeMissionStatus,
  mission_data: MissionData,
  context_files: string[],
  reviewed_context_files: string[] | null,
  created_at: string,
  updated_at: string,
}

export interface MissionExecution {
  execution_id: string,
  mission_id: string,
  execution_status: MissionExecutionStatus,
  mission_data: MissionData,
  context_files: MissionExecutionContextFile[],
  original_actions: MissionAction[],
  reviewed_actions: MissionAction[] | null,
  created_at: string,
  updated_at: string,
}

export interface MissionExecutionContextFile {
  path: string,
  content: string,
}

export interface MissionData {
  project_dir: string;
  message: string;
  project_files: string[];
  code_language: CodeLanguage;
  framework: Framework;
}

// --- CreateMission

export interface CreateMissionRequest {
  mission_data: MissionData;
}

export interface CreateMissionResponse {
  mission_id: string;
  mission_status: string;
  context_files: string[];
}

// --- ExecuteMission

export interface ExecuteMissionRequest {
  mission_id: string,
  mission_data: MissionData,
  context_files: MissionExecutionContextFile[],
}

export interface ExecuteMissionResponse {
  execution_id: string,
  mission_id: string,
  execution_status: MissionExecutionStatus,
  original_actions: MissionAction[],
}

// --- SearchExecutions

export interface SearchExecutionsRequest {
  filter: any; // todo: create type for filters
}

export enum MissionExecutionStatus {
  Created = 'Created',
  Approved = 'Approved',
  Fail = 'Fail',
  Ok = 'Ok',
  Perfect = 'Perfect',
}

export interface MissionAction {
  action_type: MissionActionType,
  path: string,
  content: string,
}

export enum MissionActionType {
  CreateFile = 'CreateFile',
  UpdateFile = 'UpdateFile',
}

export enum CodeMissionStatus {
  Created = 'Created',
  Approved = 'Approved',
  Fail = 'Fail',
  Perfect = 'Perfect',
}

// --- Login

export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface AuthRefreshTokenRequest {
  refresh_token: string;
}

// --- Retry

export interface RetryExecutionRequest {
  message: string;
}
