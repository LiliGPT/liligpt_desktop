use super::super::code_analyst;
use super::super::prompter;

#[tauri::command]
pub async fn fetch_missions() -> Result<impl serde::Serialize, String> {
    let result = prompter::missions::fetch_missions().await?;
    Ok(result)
}
