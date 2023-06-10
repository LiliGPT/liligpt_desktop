use super::super::code_analyst;
use super::super::prompter;

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
            "{}/prompt/{}/approve",
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
    let prompt = prompter::PrompterResponse::find_by_prompt_id(prompt_id).await?;
    for action in prompt.actions {
        match action.action_type {
            prompter::PrompterResponseActionType::CreateFile => {
                let file_path = format!("{}/{}", path, action.path);
                let file_path = std::path::Path::new(&file_path);
                // create directory with mkdir -p
                let parent = file_path.parent().unwrap();
                let _mkdir = std::fs::create_dir_all(parent).ok();
                // create file with content
                std::fs::write(file_path, action.content).ok()
            }
            prompter::PrompterResponseActionType::UpdateFile => {
                let file_path = format!("{}/{}", path, action.path);
                let file_path = std::path::Path::new(&file_path);
                // overwrite file with content
                std::fs::write(file_path, action.content).ok()
            }
            prompter::PrompterResponseActionType::DeleteFile => {
                let file_path = format!("{}/{}", path, action.path);
                let file_path = std::path::Path::new(&file_path);
                // delete file
                std::fs::remove_file(file_path).ok()
            }
        };
    }
    Ok(())
}
