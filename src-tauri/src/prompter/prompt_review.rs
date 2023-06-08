use std::path::Path;

use git2::{Repository, StatusOptions};

use super::{
    types::{PrompterResponseAction, RelevantFilesResponse},
    PrompterResponse, PrompterResponseActionType,
};

pub async fn review_prompt(project_dir: &str, prompt_id: &str) -> Result<(), String> {
    let reviewed_actions = get_prompt_actions_from_path(Path::new(project_dir));
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}/prompt/{}/review_actions",
            dotenv!("PROMPTER_URL"),
            prompt_id
        ))
        .json(&reviewed_actions)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(error) => return Err(format!("Failed to fetch relevant files (0x1): {}", error)),
    };

    let response = response.json::<RelevantFilesResponse>().await;
    let _response = match response {
        Ok(response) => response,
        Err(error) => return Err(format!("Failed to parse relevant files (0x2): {}", error)),
    };

    Ok(())
}

fn get_prompt_actions_from_path(repo_path: &Path) -> Vec<PrompterResponseAction> {
    let repo = Repository::open(repo_path).unwrap();
    let mut options = StatusOptions::new();
    options.include_untracked(true);
    let statuses = repo.statuses(Some(&mut options)).unwrap();

    let mut actions = Vec::new();
    for entry in statuses.iter() {
        let status = entry.status();
        let file_path = entry.path().unwrap().to_string();
        let action_type = if status.is_index_new() || status.is_wt_new() {
            PrompterResponseActionType::CreateFile
        } else if status.is_index_deleted() || status.is_wt_deleted() {
            PrompterResponseActionType::DeleteFile
        } else {
            PrompterResponseActionType::UpdateFile
        };
        let content = if action_type != PrompterResponseActionType::DeleteFile {
            std::fs::read_to_string(repo_path.join(&file_path)).unwrap()
        } else {
            "".to_string()
        };
        actions.push(PrompterResponseAction {
            action_type,
            content,
            path: file_path,
        });
    }
    actions
}
