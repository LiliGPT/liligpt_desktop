use crate::code_missions_api::{retry_execution, ApiError, RetryExecutionRequest};

use super::command_request::CommandRequest;

#[tauri::command]
pub async fn retry_execution_command(
    request: CommandRequest,
) -> Result<impl serde::Serialize, ApiError> {
    let request = RetryExecutionRequest {
        execution_id: request.execution_id,
        message: request.message,
    };
    let result = retry_execution(request).await?;
    Ok(result)
}
