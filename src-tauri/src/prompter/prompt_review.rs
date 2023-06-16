use std::path::Path;

use git2::{Repository, StatusOptions};

use super::{
    types::{PrompterResponseAction, RelevantFilesResponse},
    PrompterResponse, PrompterResponseActionType,
};

pub async fn review_prompt(project_dir: &str, prompt_id: &str) -> Result<(), String> {
    Ok(())
}
