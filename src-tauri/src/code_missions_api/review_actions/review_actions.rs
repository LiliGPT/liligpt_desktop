use crate::code_missions_api::{
    api_client::{api_post, EmptyApiResponse},
    ApiError,
};

use super::ReviewActionsRequest;

pub async fn review_actions(request: ReviewActionsRequest) -> Result<(), ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let _response = api_post::<ReviewActionsRequest, EmptyApiResponse>(
        &access_token,
        &format!("/executions/{}/review_actions", &request.execution_id),
        &request,
    )
    .await?;
    Ok(())
    // let http_client = reqwest::Client::new();
    // let response = http_client
    //     .post(&format!(
    //         "{}/executions/{}/review_actions",
    //         dotenv!("PROMPTER_URL"),
    //         &request.execution_id
    //     ))
    //     .json(&request)
    //     .send()
    //     .await;
    // let _response = match response {
    //     Ok(response) => response,
    //     Err(err) => return Err(format!("[review_actions] response error: {}", err)),
    // };
    // Ok(())
}
