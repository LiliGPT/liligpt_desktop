use serde_json::json;

use crate::code_missions_api::{search_executions, ApiError, SearchExecutionsRequest};

#[tauri::command]
pub async fn search_executions_command(
    request: SearchExecutionsRequest,
) -> Result<impl serde::Serialize, String> {
    match search_executions(request).await {
        Ok(result) => Ok(json!(result)),
        Err(err) => return Ok(json!(err)),
    }
}
