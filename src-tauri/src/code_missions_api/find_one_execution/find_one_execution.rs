use crate::code_missions_api::{
    api_client::{api_get, EmptyApiResponse},
    ApiError, MissionExecution,
};

pub async fn find_one_execution(execution_id: &str) -> Result<MissionExecution, ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let response =
        api_get::<MissionExecution>(&access_token, &format!("/executions/{}", execution_id))
            .await?;
    Ok(response.unwrap())
    // let http_client = reqwest::Client::new();
    // let response = http_client
    //     .get(&format!(
    //         "{}/executions/{}",
    //         dotenv!("PROMPTER_URL"),
    //         execution_id,
    //     ))
    //     .send()
    //     .await;
    // let response = match response {
    //     Ok(response) => response,
    //     Err(err) => return Err(format!("[execute_mission] response error: {}", err)),
    // };
    // let response_text = match response.json().await {
    //     Ok(resp) => resp,
    //     Err(err) => return Err(format!("[execute_mission] json error: {}", err)),
    // };
    // Ok(response_text)
}
