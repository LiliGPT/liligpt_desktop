use super::SetFailRequest;

pub async fn set_fail(request: SetFailRequest) -> Result<(), String> {
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
        Err(err) => return Err(format!("[set_fail] response error: {}", err)),
    };
    let response_text = match response.json().await {
        Ok(resp) => resp,
        Err(err) => return Err(format!("[set_fail] json error: {}", err)),
    };
    Ok(response_text)
}
