use super::RetryExecutionRequest;

pub async fn retry_execution(request: RetryExecutionRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/executions/{}/retry",
            dotenv!("PROMPTER_URL"),
            &request.execution_id
        ))
        // .json(&request)
        .send()
        .await;
    let _response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[retry_execution] response error: {}", err)),
    };
    Ok(())
}
