use crate::code_missions_api::{
    api_client::{api_post, EmptyApiResponse},
    ApiError,
};

use super::AddContextFilesRequest;

pub async fn add_context_files(request: AddContextFilesRequest) -> Result<(), ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let _response = api_post::<AddContextFilesRequest, EmptyApiResponse>(
        &access_token,
        &format!("/executions/{}/add_context_files", &request.execution_id,),
        &request,
    )
    .await?;
    Ok(())
    // let http_client = reqwest::Client::new();
    // let response = http_client
    //     .post(&format!(
    //         "{}/executions/{}/add_context_files",
    //         dotenv!("PROMPTER_URL"),
    //         &request.execution_id,
    //     ))
    //     .json(&request)
    //     .send()
    //     .await;
    // println!("add_context_files response: {:?}", response);
    // let _response = match response {
    //     Ok(response) => response,
    //     Err(err) => return Err(format!("[add_context_files] response error: {}", err)),
    // };
    // Ok(())
}
