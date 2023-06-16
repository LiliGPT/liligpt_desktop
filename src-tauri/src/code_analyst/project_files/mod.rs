use crate::io::LocalPath;

use super::{CodeLanguage, Framework};

mod nestts;

pub fn get_project_files(
    project_dir: LocalPath,
    code_language: &CodeLanguage,
    framework: &Framework,
) -> Vec<String> {
    match framework {
        Framework::NodeNest => nestts::get_project_files(project_dir),
        _ => unimplemented!(),
    }
}
