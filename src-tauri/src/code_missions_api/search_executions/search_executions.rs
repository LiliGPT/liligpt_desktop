use crate::code_missions_api::MissionExecution;

use super::SearchExecutionsRequest;

pub async fn search_executions(
    request: SearchExecutionsRequest,
) -> Result<Vec<MissionExecution>, String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!("{}/executions/search", dotenv!("PROMPTER_URL")))
        .json(&request)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[search_executions] response error: {}", err)),
    };
    let response_text = match response.json().await {
        Ok(resp) => resp,
        Err(err) => return Err(format!("[search_executions] json error: {}", err)),
    };
    Ok(response_text)
}
