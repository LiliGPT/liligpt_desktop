use crate::code_missions_api::{api_client::api_post, ApiError};

use super::SetApprovedRequest;

pub async fn set_approved(request: SetApprovedRequest) -> Result<(), ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let _response = api_post::<SetApprovedRequest, ()>(
        &access_token,
        &format!("/executions/{}/approve", request.execution_id),
        &request,
    )
    .await?;
    Ok(())
    // let http_client = reqwest::Client::new();
    // let response = http_client
    //     .post(&format!(
    //         "{}/executions/{}/approve",
    //         dotenv!("PROMPTER_URL"),
    //         request.execution_id
    //     ))
    //     .send()
    //     .await;
    // let _response = match response {
    //     Ok(response) => response,
    //     Err(err) => return Err(format!("[set_approved] response error: {}", err)),
    // };
    // Ok(())
}
