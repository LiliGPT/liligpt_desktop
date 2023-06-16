use crate::code_missions_api::MissionExecution;

use super::ExecuteMissionRequest;

pub async fn execute_mission(request: ExecuteMissionRequest) -> Result<MissionExecution, String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!("{}/missions/execute", dotenv!("PROMPTER_URL")))
        .json(&request)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(err) => return Err(format!("[execute_mission] response error: {}", err)),
    };
    let response_text = match response.json().await {
        Ok(resp) => resp,
        Err(err) => return Err(format!("[execute_mission] json error: {}", err)),
    };
    Ok(response_text)
}
