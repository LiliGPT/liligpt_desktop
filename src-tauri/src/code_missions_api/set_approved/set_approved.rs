use super::SetApprovedRequest;

pub async fn set_approved(request: SetApprovedRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/executions/{}/approve",
            dotenv!("PROMPTER_URL"),
            request.execution_id
        ))
        .send()
        .await;
    let _response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[set_approved] response error: {}", err)),
    };
    Ok(())
}
