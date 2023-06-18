use crate::code_missions_api::{api_client::api_post, ApiError, MissionExecution};

use super::SearchExecutionsRequest;

pub async fn search_executions(
    request: SearchExecutionsRequest,
) -> Result<Vec<MissionExecution>, ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let response = api_post::<SearchExecutionsRequest, Vec<MissionExecution>>(
        &access_token,
        "/executions/search",
        &request,
    )
    .await?;
    Ok(response.unwrap())
    // let access_token = crate::auth::get_access_token();
    // let http_client = reqwest::Client::new();
    // let response = http_client
    //     .post(&format!("{}/executions/search", dotenv!("PROMPTER_URL")))
    //     .bearer_auth(access_token.unwrap_or_default())
    //     .json(&request)
    //     .send()
    //     .await;
    // let response = match response {
    //     Ok(response) => response,
    //     Err(err) => return Err(ApiError::from(err, "Failed to send request")),
    // };
    // match response.status() {
    //     reqwest::StatusCode::OK => {
    //         let response_text = match response.json().await {
    //             Ok(resp) => resp,
    //             Err(err) => {
    //                 return Err(ApiError::from(
    //                     err,
    //                     "Failed to parse response as a MissionExecution",
    //                 ))
    //             }
    //         };
    //         Ok(response_text)
    //     }
    //     _ => {
    //         let response_status = response.status().as_u16() as i32;
    //         let response_text = &response.text().await.unwrap_or("Unknown error".to_string());
    //         Err(ApiError {
    //             status_code: response_status,
    //             message: response_text.to_string(),
    //         })
    //     }
    // }
}
