use super::SetApprovedRequest;

pub async fn set_approved(request: SetApprovedRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/executions/{}/approve",
            dotenv!("PROMPTER_URL"),
            request.execution_id
        ))
        .json(&request)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[set_approved] response error: {}", err)),
    };
    let response_text = match response.json().await {
        Ok(resp) => resp,
        Err(err) => return Err(format!("[set_approved] json error: {}", err)),
    };
    Ok(response_text)
}
