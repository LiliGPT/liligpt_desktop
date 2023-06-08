#[derive(strum::Display, serde::Serialize, serde::Deserialize, Default, Clone)]
pub enum CodeLanguage {
    NodeJs,
    NodeTs,
    // JavascriptJs,
    // JavascriptTs,
    #[default]
    Unknown,
}

#[derive(strum::Display, serde::Serialize, serde::Deserialize, Default, Clone)]
pub enum Framework {
    // instead of serializing as NodeTs, I want to serialize as Nest
    NodeNest,
    NodeExpress,
    Tauri,
    #[default]
    Unknown,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct SubprojectDescriptor {
    pub name: String,
    pub path: String,
    pub code_language: CodeLanguage,
    pub framework: Framework,
}

#[derive(serde::Serialize, Default)]
pub struct PathInfo {
    pub project_dir: String,
    pub code_language: CodeLanguage,
    pub framework: Framework,
    pub dependencies_installed: bool,
    pub local_server_commands: Vec<String>,
    pub subprojects: Vec<SubprojectDescriptor>,
}
