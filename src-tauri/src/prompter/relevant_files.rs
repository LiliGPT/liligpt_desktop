use std::{fs, path::Path};

use ignore::gitignore::GitignoreBuilder;

use super::super::code_analyst;
use super::types;

impl types::RelevantFilesRequest {
    pub fn new(path_info: &code_analyst::types::PathInfo, message: &str) -> Self {
        let files = read_valid_file_paths(
            &path_info.project_dir,
            "",
            regex::Regex::new(r"src\/.*").unwrap(),
        );
        Self {
            message: message.to_string(),
            code_language: path_info.code_language.clone(),
            framework: path_info.framework.clone(),
            files,
        }
    }

    pub async fn fetch_relevant_files(&self) -> Result<types::RelevantFilesResponse, String> {
        let http_client = reqwest::Client::new();
        let response = http_client
            .post(&format!("{}/get_relevant_files", dotenv!("PROMPTER_URL")))
            .json(&self)
            .send()
            .await;
        let response = match response {
            Ok(response) => response,
            Err(error) => return Err(format!("Failed to fetch relevant files (0x1): {}", error)),
        };

        let response = response.json::<types::RelevantFilesResponse>().await;
        let response = match response {
            Ok(response) => response,
            Err(error) => return Err(format!("Failed to parse relevant files (0x2): {}", error)),
        };

        Ok(response)
    }
}

/// Read all files from a directory recursively
/// and return a vector of file paths
/// each file path is a relative path from the project directory that matches the regex
/// e.g. src/main.ts, src/app/app.module.ts
fn read_valid_file_paths(base_dir: &str, uri: &str, regex: regex::Regex) -> Vec<String> {
    // println!("Reading files from {}", uri);
    let mut files = Vec::new();
    let cwd = Path::new(base_dir).join(uri);
    let absolute_paths = fs::read_dir(cwd).unwrap().map(|res| res.map(|e| e.path()));
    for absolute_path in absolute_paths {
        let absolute_path = absolute_path.ok().unwrap();
        let relative_path = absolute_path.strip_prefix(base_dir).unwrap();
        if absolute_path.is_dir() {
            files.append(&mut read_valid_file_paths(
                base_dir,
                &relative_path.to_str().unwrap(),
                regex.clone(),
            ));
        } else {
            let path_str = relative_path.to_str().unwrap();
            if regex.is_match(path_str) && !is_ignored_by_gitignore(base_dir, path_str) {
                files.push(path_str.to_string());
            }
        }
    }
    files
}

fn is_ignored_by_gitignore(base_dir: &str, file_relative_path: &str) -> bool {
    let gitignore_path = Path::new(base_dir).join(".gitignore");
    let mut gitignore = GitignoreBuilder::new(base_dir);
    gitignore.add(Path::new(&gitignore_path));
    if let Some(gitignore) = gitignore.build().ok() {
        return gitignore
            .matched_path_or_any_parents(file_relative_path, false)
            .is_ignore();
    }
    println!("Failed to read .gitignore");
    false
}
