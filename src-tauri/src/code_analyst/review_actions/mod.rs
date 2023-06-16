use std::path::Path;

use crate::{
    code_missions_api::{
        MissionAction, MissionActionType, MissionExecutionContextFile, ReviewActionsRequest,
    },
    git_repo::{git_stash, git_stash_pop},
};

mod nest;

pub fn get_review_actions_request_from_path(
    project_dir: &str,
    execution_id: &str,
) -> ReviewActionsRequest {
    let reviewed_actions = nest::get_reviewed_actions_from_path(project_dir);
    let context_files = get_context_files(project_dir, &reviewed_actions);
    ReviewActionsRequest {
        execution_id: execution_id.to_string(),
        reviewed_actions,
        context_files,
    }
}

fn get_context_files(
    project_dir: &str,
    reviewed_actions: &Vec<MissionAction>,
) -> Option<Vec<MissionExecutionContextFile>> {
    git_stash(project_dir);
    let mut context_files = Vec::new();
    for action in reviewed_actions {
        if action.action_type == MissionActionType::UpdateFile {
            let file_path = Path::new(project_dir).join(&action.path);
            let file_content = std::fs::read_to_string(&file_path).unwrap_or("".to_string());
            context_files.push(MissionExecutionContextFile {
                path: action.path.clone(),
                content: file_content,
            });
        }
    }
    git_stash_pop(project_dir);
    None
}
