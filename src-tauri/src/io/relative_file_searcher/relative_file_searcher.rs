use std::path::Path;

use ignore::Walk;

use crate::io::LocalPath;

pub struct RelativeFileSearcher<'a> {
    base_path: &'a LocalPath,
}

impl<'b> RelativeFileSearcher<'b> {
    pub fn new(base_path: &'b LocalPath) -> Self {
        Self { base_path }
    }

    /// Find all git files from a given path
    fn find_git_files(&self) -> Vec<String> {
        let dir = self.base_path.as_path();
        let mut files = Vec::new();
        if dir.is_dir() {
            for entry in Walk::new(dir) {
                match entry {
                    Ok(entry) => files.push(entry.path().display().to_string()),
                    Err(_) => continue,
                }
            }
        }
        files
    }

    pub fn find_files_with_exact_names_abs_multiple(
        &self,
        relative_paths: Vec<&str>,
    ) -> Vec<String> {
        let mut result = Vec::new();
        for relative_path in relative_paths {
            let files = self.find_files_with_exact_name_abs(relative_path);
            result.extend(files);
        }
        result
    }

    pub fn find_files_with_exact_name_abs(&self, relative_path: &str) -> Vec<String> {
        let files = self.find_git_files();
        let result = files
            .iter()
            .filter(|file| file.ends_with(format!("/{}", relative_path).as_str()))
            .map(|file| file.to_string())
            .collect();
        result
    }

    // pub fn find_files_with_exact_name_rel(&self, relative_path: &str) -> Vec<String> {
    //     let files = self.find_files_with_exact_name_abs(relative_path);
    //     let result = files
    //         .iter()
    //         .map(|file| {
    //             let path = Path::new(file);
    //             let path = path.strip_prefix(self.base_path.as_path()).unwrap();
    //             path.display().to_string()
    //         })
    //         .collect();
    //     result
    // }

    pub fn find_files_with_extensions(&self, exts: Vec<&str>) -> Vec<String> {
        let files = self.find_git_files();
        let result = files
            .iter()
            .filter(|file| {
                let path = Path::new(file);
                let extension = path.extension();
                if let Some(extension) = extension {
                    return exts.contains(&extension.to_str().unwrap());
                }
                false
            })
            .map(|file| file.to_string())
            .collect();
        result
    }
}
