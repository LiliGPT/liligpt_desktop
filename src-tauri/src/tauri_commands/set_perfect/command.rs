use crate::code_missions_api::{set_perfect, SetPerfectRequest};

#[tauri::command]
pub async fn set_perfect_command(
    request: SetPerfectRequest,
) -> Result<impl serde::Serialize, String> {
    let result = set_perfect(request).await?;
    Ok(result)
}
