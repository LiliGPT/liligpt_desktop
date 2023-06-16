use super::ReviewActionsRequest;

pub async fn review_actions(request: ReviewActionsRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/executions/{}/review_actions",
            dotenv!("PROMPTER_URL"),
            &request.execution_id
        ))
        .json(&request)
        .send()
        .await;
    let _response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[review_actions] response error: {}", err)),
    };
    Ok(())
}
