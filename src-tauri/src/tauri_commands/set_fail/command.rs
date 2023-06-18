use crate::code_missions_api::{set_fail, ApiError, SetFailRequest};

#[tauri::command]
pub async fn set_fail_command(request: SetFailRequest) -> Result<impl serde::Serialize, ApiError> {
    let result = set_fail(request).await?;
    Ok(result)
}
