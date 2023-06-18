use std::path::Path;

use serde_json::json;

use crate::{
    code_analyst::{
        frameworks::detect_framework_from_path, languages::detect_code_language_from_path,
        project_files::get_project_files,
    },
    code_missions_api::{
        add_context_files, create_mission, find_one_execution, AddContextFilesRequest, ApiError,
        CreateMissionRequest, ExecuteMissionRequest, MissionData, MissionExecutionContextFile,
        MissionExecutionStatus,
    },
    io::LocalPath,
};

use super::command_request::CommandRequest;

#[tauri::command]
pub async fn add_context_files_command(
    request: CommandRequest,
) -> Result<impl serde::Serialize, ApiError> {
    let files_to_add = pick_files_to_add(&request)?;
    let context_files: Vec<MissionExecutionContextFile> = files_to_add
        .iter()
        .map(|file| MissionExecutionContextFile {
            path: file.to_string(),
            content: std::fs::read_to_string(Path::new(&request.project_dir).join(file))
                .unwrap_or("".to_string()),
        })
        .filter(|file| file.content.len() > 0)
        .collect();
    let execution = find_one_execution(&request.execution_id).await?;
    if execution.execution_status != MissionExecutionStatus::Created
        && execution.execution_status != MissionExecutionStatus::Approved
        && execution.execution_status != MissionExecutionStatus::Ok
    {
        return Err(ApiError {
            message: "Execution is not in a state where context files can be added".to_string(),
            status_code: 0,
        });
    }
    let request = AddContextFilesRequest {
        execution_id: request.execution_id,
        context_files,
    };
    let result = add_context_files(request).await?;
    Ok(result)
}

fn pick_files_to_add(request: &CommandRequest) -> Result<Vec<String>, ApiError> {
    let picked_files = tauri::api::dialog::blocking::FileDialogBuilder::new().pick_files();
    let picked_files = match picked_files {
        Some(files) => files,
        None => {
            return Err(ApiError {
                message: "No files picked (1)".to_string(),
                status_code: 0,
            })
        }
    };
    if picked_files.len() == 0 {
        return Err(ApiError {
            message: "No files picked (2)".to_string(),
            status_code: 0,
        });
    }
    // println!("Picked files: {:?}", picked_files);
    // let code_language = match detect_code_language_from_path(&request.project_dir) {
    //     Ok(language) => language,
    //     Err(error) => return Err(format!("Failed to detect code language: {}", error)),
    // };
    // let framework = detect_framework_from_path(&request.project_dir, &code_language);
    // let project_files = get_project_files(
    //     LocalPath(request.project_dir.clone()),
    //     &code_language,
    //     &framework,
    // );
    // println!("Project files: {:?}", project_files);
    let mut files_to_add: Vec<String> = Vec::new();
    for file in picked_files {
        let file_path = Path::new(&file);
        if !file_path.is_file() {
            continue;
        }
        // if file_path is not in project_files, continue
        if !file_path.starts_with(&request.project_dir) {
            continue;
        }
        let file_path = file_path.strip_prefix(&request.project_dir);
        let file_path = match file_path {
            Ok(path) => path,
            Err(_) => continue,
        };
        let file_path = file_path.to_str().unwrap();
        println!("Search this file: {}", &file_path);
        // if !project_files.contains(&file_path.to_string()) {
        //     continue;
        // }
        files_to_add.push(file_path.to_string());
    }
    Ok(files_to_add)
}
