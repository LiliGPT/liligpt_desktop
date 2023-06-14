use super::ReviewActionsRequest;

pub async fn review_actions(request: ReviewActionsRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/executions/{}/review_actions",
            dotenv!("PROMPTER_URL"),
            request.execution_id
        ))
        .json(&request.actions)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[review_actions] response error: {}", err)),
    };
    let response_text = match response.json().await {
        Ok(resp) => resp,
        Err(err) => return Err(format!("[review_actions] json error: {}", err)),
    };
    Ok(response_text)
}
