use crate::code_missions_api::{search_executions, SearchExecutionsRequest};

#[tauri::command]
pub async fn search_executions_command(
    request: SearchExecutionsRequest,
) -> Result<impl serde::Serialize, String> {
    let result = search_executions(request).await?;
    Ok(result)
}
