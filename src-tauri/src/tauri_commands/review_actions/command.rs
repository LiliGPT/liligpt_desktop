use crate::code_missions_api::{review_actions, ReviewActionsRequest};

#[tauri::command]
pub async fn review_actions_command(
    request: ReviewActionsRequest,
) -> Result<impl serde::Serialize, String> {
    let result = review_actions(request).await?;
    Ok(result)
}
