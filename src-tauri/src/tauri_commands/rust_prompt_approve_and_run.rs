use crate::code_missions_api::find_one_execution;
use crate::code_missions_api::MissionActionType;

#[tauri::command]
pub async fn rust_prompt_approve_and_run(
    path: String,
    prompt_id: String,
) -> Result<impl serde::Serialize, String> {
    approve_prompt(&prompt_id).await?;
    run_prompt(&path, &prompt_id).await?;
    Ok(())
}

async fn approve_prompt(prompt_id: &str) -> Result<(), String> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/executions/{}/approve",
            dotenv!("PROMPTER_URL"),
            prompt_id
        ))
        .send()
        .await;
    if response.is_err() {
        return Err("Failed to connect to prompter".to_string());
    }
    Ok(())
}

async fn run_prompt(path: &str, prompt_id: &str) -> Result<(), String> {
    let execution = find_one_execution(prompt_id).await?;
    let actions = match &execution.reviewed_actions {
        Some(actions) => actions,
        None => &execution.original_actions,
    };
    for action in actions {
        match action.action_type {
            MissionActionType::CreateFile => {
                let file_path = format!("{}/{}", path, action.path);
                let file_path = std::path::Path::new(&file_path);
                // create directory with mkdir -p
                let parent = file_path.parent().unwrap();
                let _mkdir = std::fs::create_dir_all(parent).ok();
                // create file with content
                std::fs::write(file_path, &action.content).ok()
            }
            MissionActionType::UpdateFile => {
                let file_path = format!("{}/{}", path, action.path);
                let file_path = std::path::Path::new(&file_path);
                // overwrite file with content
                std::fs::write(file_path, &action.content).ok()
            } // MissionActionType::DeleteFile => {
              //     let file_path = format!("{}/{}", path, action.path);
              //     let file_path = std::path::Path::new(&file_path);
              //     // delete file
              //     std::fs::remove_file(file_path).ok()
              // }
        };
    }
    Ok(())
}
