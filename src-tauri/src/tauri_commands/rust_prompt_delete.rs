use super::super::code_analyst;
use super::super::prompter;

#[tauri::command]
pub async fn rust_prompt_delete(prompt_id: String) -> Result<impl serde::Serialize, String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .delete(&format!("{}/prompt/{}", dotenv!("PROMPTER_URL"), prompt_id))
        .send()
        .await;
    if response.is_err() {
        return Err("Failed to connect to prompter".to_string());
    }
    Ok(())
}
