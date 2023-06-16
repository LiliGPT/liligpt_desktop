use super::SetPerfectRequest;

pub async fn set_perfect(request: SetPerfectRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/executions/{}/is_perfect",
            dotenv!("PROMPTER_URL"),
            request.execution_id
        ))
        .send()
        .await;
    let _response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[set_perfect] response error: {}", err)),
    };
    Ok(())
}
