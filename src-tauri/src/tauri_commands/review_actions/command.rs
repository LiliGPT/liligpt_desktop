use crate::code_missions_api::{review_actions, ApiError, MissionActionType, ReviewActionsRequest};

use super::command_request::CommandRequest;

#[tauri::command]
pub async fn review_actions_command(
    request: CommandRequest,
) -> Result<impl serde::Serialize, ApiError> {
    let request = ReviewActionsRequest {
        execution_id: request.execution_id,
        reviewed_actions: request.reviewed_actions,
        context_files: None,
    };
    let result = review_actions(request).await?;
    Ok(result)
}
