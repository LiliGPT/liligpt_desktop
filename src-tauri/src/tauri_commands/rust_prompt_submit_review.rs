use super::super::prompter;
#[tauri::command]
pub async fn rust_prompt_submit_review(
    cwd: String,
    prompt_id: String,
) -> Result<impl serde::Serialize, String> {
    // todo - check if this list is still valid
    // 1. check if there are changes in the repo
    //  . if not, stop
    // 2. transform repo changes in an array of PromptAction
    //  . if the array is empty, stop
    // 3. fetch the prompt from prompter
    // 4. compare the prompt PromptAction changes to check if:
    //  . they are both fullfilled
    //  . they are different
    //  . at least one of the reviewed actions has { action_type, path } equal to original_actions
    // let reviewed_actions =
    //     get_prompt_actions_from_path(Path::new("/home/l/sample-projects/nestjs-example-project"));
    let _result = prompter::prompt_review::review_prompt(&cwd, &prompt_id).await?;
    Ok(())
}
