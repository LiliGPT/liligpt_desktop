use std::path::Path;

use crate::io::{LocalPath, RelativeFileSearcher};

pub fn get_project_files(project_dir: LocalPath) -> Vec<String> {
    let searcher = RelativeFileSearcher::new(&project_dir);
    let mut files: Vec<String> = Vec::new();
    let maints = searcher.find_files_with_exact_names_abs_multiple(vec!["main.ts"]);
    let app_module = searcher.find_files_with_exact_names_abs_multiple(vec!["app.module.ts"]);
    match maints.get(0) {
        Some(maints_path_abs) => {
            add_file_and_imports(&mut files, &project_dir.as_path(), maints_path_abs);
        }
        None => {}
    };
    match app_module.get(0) {
        Some(app_module_path_abs) => {
            add_file_and_imports(&mut files, &project_dir.as_path(), app_module_path_abs);
        }
        None => {}
    };
    files
}

fn add_file_and_imports(files: &mut Vec<String>, project_dir: &Path, file_path_abs: &str) {
    let file_path_rel = Path::new(&file_path_abs)
        .strip_prefix(project_dir)
        .unwrap()
        .display()
        .to_string();
    if !files.contains(&file_path_rel) {
        files.push(file_path_rel);
    }
    let required_files = get_imported_files_abs(&file_path_abs);
    for required_file in required_files {
        files.push(
            Path::new(&required_file)
                .strip_prefix(project_dir)
                .unwrap()
                .display()
                .to_string(),
        );
    }
}

// get all paths that are imported in a given file
// created by github copilot
fn get_imported_files_abs(path: &str) -> Vec<String> {
    let mut files: Vec<String> = vec![];
    let content = match std::fs::read_to_string(path) {
        Ok(content) => content,
        Err(_) => return files,
    };
    let path = Path::new(path);
    let path_dir = path.parent().unwrap();
    let path_str = path.to_str().unwrap();
    let lines: Vec<String> = content
        .split("\n")
        .filter(|l| l.contains("require") || l.contains("import"))
        .map(|l| l.to_string())
        .collect();
    // println!("---path: {:?}\n\n", &content);
    for line in lines {
        // println!("line: {}", &line);
        let single_quote = line.contains("'");
        let double_quote = line.contains("\"");
        if single_quote && double_quote {
            println!(
              "[nest.rs@get_imported_files] import contains both single and double quotes: ({}) {}",
              path_str,
              line,
          );
            continue;
        }
        let split_char = if single_quote { "'" } else { "\"" };
        let filepath = line
            .split(split_char)
            .filter(|l| l.contains("/") && !l.contains("@"))
            .last();
        if let Some(filepath) = filepath {
            let relative_filepath = format!("{}.ts", filepath.to_string());
            let mut absolute_filepath = path_dir.to_path_buf();
            for part in relative_filepath.split("/") {
                if part != "." {
                    absolute_filepath = absolute_filepath.join(part);
                }
            }
            if absolute_filepath.exists() {
                files.push(absolute_filepath.display().to_string());
            }
        }
    }
    files
}
