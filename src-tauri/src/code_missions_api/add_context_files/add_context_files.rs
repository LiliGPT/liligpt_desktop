use super::AddContextFilesRequest;

pub async fn add_context_files(request: AddContextFilesRequest) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/executions/{}/add_context_files",
            dotenv!("PROMPTER_URL"),
            &request.execution_id,
        ))
        .json(&request)
        .send()
        .await;
    println!("add_context_files response: {:?}", response);
    let _response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[add_context_files] response error: {}", err)),
    };
    Ok(())
}
