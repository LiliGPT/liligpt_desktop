use crate::{
    code_analyst,
    code_missions_api::{review_actions, ApiError, ReviewActionsRequest},
};

#[tauri::command]
pub async fn rust_prompt_submit_review(
    cwd: String,
    prompt_id: String,
) -> Result<impl serde::Serialize, ApiError> {
    let payload: ReviewActionsRequest =
        code_analyst::review_actions::get_review_actions_request_from_path(&cwd, &prompt_id);
    let _result = review_actions(payload).await?;
    Ok(())
    // let payload =
    //     code_analyst::review_actions::get_review_actions_request_from_path(&cwd, &prompt_id);
    // let http_client = reqwest::Client::new();
    // let response = http_client
    //     .post(&format!(
    //         "{}/executions/{}/review_actions",
    //         dotenv!("PROMPTER_URL"),
    //         &prompt_id
    //     ))
    //     .json(&payload)
    //     .send()
    //     .await;
    // let _response = match response {
    //     Ok(response) => response,
    //     Err(error) => {
    //         return Err(format!(
    //             "Failed to fetch relevant files (0x1): {} - actions: {:?}",
    //             error, &payload.reviewed_actions
    //         ))
    //     }
    // };
    // Ok(())
}
