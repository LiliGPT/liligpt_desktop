use super::SetFailRequest;

pub async fn set_fail(request: SetFailRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .delete(&format!(
            "{}/executions/{}",
            dotenv!("PROMPTER_URL"),
            request.execution_id
        ))
        .send()
        .await;
    let _response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[set_fail] response error: {}", err)),
    };
    Ok(())
}
