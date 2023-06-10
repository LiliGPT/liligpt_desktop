use super::super::prompter::types::PrompterResponseAction;

#[tauri::command]
pub async fn rust_prompt_replace_actions(
    prompt_id: String,
    actions: Vec<PrompterResponseAction>,
) -> Result<impl serde::Serialize, String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/prompt/{}/review_actions",
            dotenv!("PROMPTER_URL"),
            prompt_id
        ))
        .json(&actions)
        .send()
        .await;
    if response.is_err() {
        return Err("Failed to connect to prompter".to_string());
    }
    println!("[rust_prompt_replace_actions] response: {:?}", response);
    Ok(())
}
