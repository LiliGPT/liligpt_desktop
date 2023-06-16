use std::path::Path;

use crate::{
    code_missions_api::{
        create_mission, CreateMissionRequest, ExecuteMissionRequest, MissionData,
        MissionExecutionContextFile,
    },
    io::LocalPath,
};

#[tauri::command]
pub async fn create_mission_command(
    project_dir: String,
    message: String,
) -> Result<impl serde::Serialize, String> {
    let code_language =
        crate::code_analyst::languages::detect_code_language_from_path(&project_dir)?;
    let framework =
        crate::code_analyst::frameworks::detect_framework_from_path(&project_dir, &code_language);
    let project_files = crate::code_analyst::project_files::get_project_files(
        LocalPath(project_dir.clone()),
        &code_language,
        &framework,
    );
    let request = CreateMissionRequest {
        mission_data: MissionData {
            project_dir: project_dir.clone(),
            message: message.clone(),
            project_files: project_files.clone(),
            code_language: code_language.clone(),
            framework: framework.clone(),
        },
    };
    let mission_response = create_mission(request).await?;
    let mission_data = MissionData {
        project_dir: project_dir.clone(),
        message,
        project_files,
        code_language,
        framework,
    };
    let context_files: Vec<MissionExecutionContextFile> = mission_response
        .context_files
        .iter()
        .map(|path| MissionExecutionContextFile {
            path: path.clone(),
            content: std::fs::read_to_string(Path::new(&project_dir).join(path))
                .unwrap_or("".to_string()),
        })
        .filter(|file| file.content.len() > 0)
        .collect();
    let execute_request = ExecuteMissionRequest {
        mission_id: mission_response.mission_id,
        mission_data,
        context_files,
    };
    let result = crate::code_missions_api::execute_mission(execute_request).await?;
    Ok(result)
}
