use std::path::Path;

use git2::{Repository, StatusOptions};

use crate::{
    code_missions_api::{MissionAction, MissionActionType},
    git_repo::{git_add_changes, git_restore_changes},
};

// todo: I need to test if this function is getting all project modifications
// all the files that are changed locally should be returned by this function
// you can check by opening the Insomnia execution and look for the "reviewed_actions" field, should contain the files
pub fn get_reviewed_actions_from_path(project_dir: &str) -> Vec<MissionAction> {
    git_add_changes(project_dir);
    let repo_path = Path::new(project_dir);
    let repo = Repository::open(repo_path).unwrap();
    let mut options = StatusOptions::new();
    options.include_untracked(true);
    options.recurse_untracked_dirs(true);
    let statuses = repo.statuses(Some(&mut options)).unwrap();

    let mut actions = Vec::new();
    for entry in statuses.iter() {
        let status = entry.status();
        let file_path = entry.path().unwrap().to_string();
        let action_type = if status.is_index_new() || status.is_wt_new() {
            MissionActionType::CreateFile
        // } else if status.is_index_deleted() || status.is_wt_deleted() {
        //     MissionActionType::DeleteFile
        } else {
            MissionActionType::UpdateFile
        };
        // let content = if action_type != MissionActionType::DeleteFile {
        let content = if true {
            println!(
                "[prompt_review.get_prompt_actions_from_path] reading action file: {} {}/{}",
                &action_type,
                &repo_path.display(),
                &file_path
            );
            std::fs::read_to_string(repo_path.join(&file_path)).unwrap_or("".to_string())
        } else {
            "".to_string()
        };
        if content.len() > 0
            && !&file_path.contains("package.json")
            && !&file_path.contains("package-lock.json")
            && !&file_path.contains("node_modules")
            && !&file_path.contains("yarn.lock")
        {
            actions.push(MissionAction {
                action_type,
                content,
                path: file_path,
            });
        }
    }
    println!("actions: {:?}", &actions);
    git_restore_changes(project_dir);
    actions
}
