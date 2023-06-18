use crate::code_missions_api::{
    api_client::{api_post, EmptyApiResponse},
    ApiError,
};

use super::RetryExecutionRequest;

pub async fn retry_execution(request: RetryExecutionRequest) -> Result<(), ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let _response = api_post::<RetryExecutionRequest, EmptyApiResponse>(
        &access_token,
        &format!("/executions/{}/retry", &request.execution_id),
        &request,
    )
    .await?;
    Ok(())
    // let http_client = reqwest::Client::new();
    // let response = http_client
    //     .post(&format!(
    //         "{}/executions/{}/retry",
    //         dotenv!("PROMPTER_URL"),
    //         &request.execution_id
    //     ))
    //     // .json(&request)
    //     .send()
    //     .await;
    // let _response = match response {
    //     Ok(response) => response,
    //     Err(err) => return Err(format!("[retry_execution] response error: {}", err)),
    // };
    // Ok(())
}
