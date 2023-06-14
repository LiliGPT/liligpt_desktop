use crate::code_missions_api::{set_approved, SetApprovedRequest};

#[tauri::command]
pub async fn set_approved_command(
    request: SetApprovedRequest,
) -> Result<impl serde::Serialize, String> {
    let result = set_approved(request).await?;
    Ok(result)
}
