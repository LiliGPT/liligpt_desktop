use crate::code_missions_api::{execute_mission, ExecuteMissionRequest};

#[tauri::command]
pub async fn execute_mission_command(
    request: ExecuteMissionRequest,
) -> Result<impl serde::Serialize, String> {
    let result = execute_mission(request).await?;
    Ok(result)
}
