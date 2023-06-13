use serde::{Deserialize, Serialize};

pub use crate::code_analyst::{CodeLanguage, Framework};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MissionData {
    pub project_dir: String,
    pub message: String,
    pub project_files: Vec<String>,
    pub code_language: CodeLanguage,
    pub framework: Framework,
}
