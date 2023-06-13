use super::{CreateMissionRequest, CreateMissionResponse};

pub async fn create_mission(
    request: CreateMissionRequest,
) -> Result<CreateMissionResponse, String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!("{}/missions/create", dotenv!("PROMPTER_URL")))
        .json(&request)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[create_mission] response error: {}", err)),
    };
    let response_text = match response.json().await {
        Ok(resp) => resp,
        Err(err) => return Err(format!("[create_mission] json error: {}", err)),
    };
    Ok(response_text)
}
