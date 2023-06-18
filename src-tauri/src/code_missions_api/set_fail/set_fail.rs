use crate::code_missions_api::{api_client::api_delete, ApiError};

use super::SetFailRequest;

pub async fn set_fail(request: SetFailRequest) -> Result<(), ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let _response = api_delete(
        &access_token,
        &format!("/executions/{}", request.execution_id),
    )
    .await?;
    Ok(())
    // let http_client = reqwest::Client::new();
    // let response = http_client
    //     .delete(&format!(
    //         "{}/executions/{}",
    //         dotenv!("PROMPTER_URL"),
    //         request.execution_id
    //     ))
    //     .send()
    //     .await;
    // let _response = match response {
    //     Ok(response) => response,
    //     Err(err) => return Err(format!("[set_fail] response error: {}", err)),
    // };
    // Ok(())
}
