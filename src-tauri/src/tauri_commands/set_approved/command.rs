use crate::code_missions_api::{set_approved, ApiError, SetApprovedRequest};

#[tauri::command]
pub async fn set_approved_command(
    request: SetApprovedRequest,
) -> Result<impl serde::Serialize, ApiError> {
    let result = set_approved(request).await?;
    Ok(result)
}
