#[derive(strum::Display, serde::Serialize)]
pub enum CodeLanguage {
    NodeJs,
    NodeTs,
    // JavascriptJs,
    // JavascriptTs,
    Unknown,
}

#[derive(strum::Display, serde::Serialize)]
pub enum Framework {
    // instead of serializing as NodeTs, I want to serialize as Nest
    NodeNest,
    NodeExpress,
    Tauri,
    Unknown,
}

#[derive(serde::Serialize)]
pub struct SubprojectDescriptor {
    pub name: String,
    pub path: String,
    pub code_language: CodeLanguage,
    pub framework: Framework,
}
