use crate::code_missions_api::{create_mission, CreateMissionRequest};

#[tauri::command]
pub async fn create_mission_command(
    request: CreateMissionRequest,
) -> Result<impl serde::Serialize, String> {
    let result = create_mission(request).await?;
    Ok(result)
}
