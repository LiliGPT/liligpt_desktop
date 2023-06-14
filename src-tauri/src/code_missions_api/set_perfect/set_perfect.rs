use super::SetPerfectRequest;

pub async fn set_perfect(request: SetPerfectRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .delete(&format!(
            "{}/executions/{}",
            dotenv!("PROMPTER_URL"),
            request.execution_id
        ))
        .json(&request)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[set_perfect] response error: {}", err)),
    };
    let response_text = match response.json().await {
        Ok(resp) => resp,
        Err(err) => return Err(format!("[set_perfect] json error: {}", err)),
    };
    Ok(response_text)
}
