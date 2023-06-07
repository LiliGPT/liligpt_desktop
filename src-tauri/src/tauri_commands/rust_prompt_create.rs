use super::super::code_analyst;
use super::super::prompter;

#[tauri::command]
pub async fn rust_prompt_create(
    prompt: prompter::PrompterRequest,
) -> Result<impl serde::Serialize, String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!("{}/prompt", dotenv!("PROMPTER_URL")))
        .json(&prompt)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(_) => return Err("Failed to connect to prompter".to_string()),
    };
    let response_text = response.text().await.unwrap_or_default();
    if response_text.is_empty() {
        return Err("Prompter response is empty".to_string());
    }
    let response = match serde_json::from_str::<prompter::PrompterResponse>(&response_text) {
        Ok(response) => response,
        Err(error) => {
            return Err(format!(
                "Failed to parse prompter response:\n\n{}\n\n{}",
                error, response_text
            ))
        }
    };
    // .unwrap()
    // .json::<prompter::PrompterResponse>()
    // .await
    // .unwrap();
    Ok(response)
}
