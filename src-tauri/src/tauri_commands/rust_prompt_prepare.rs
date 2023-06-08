use super::super::code_analyst;
use super::super::prompter;

#[tauri::command]
pub async fn rust_prompt_prepare(
    path: String,
    message: String,
) -> Result<impl serde::Serialize, String> {
    let path_info = code_analyst::get_path_info(&path)?;
    let prompt_files = path_info.get_prompter_request_files(&message).await?;
    let prompt = prompter::PrompterRequest {
        message: message,
        code_language: path_info.code_language,
        framework: path_info.framework,
        files: prompt_files,
    };
    Ok(prompt)
}
