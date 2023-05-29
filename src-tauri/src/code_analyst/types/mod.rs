#[derive(strum::Display)]
pub enum CodeLanguage {
    NodeJs,
    NodeTs,
    // JavascriptJs,
    // JavascriptTs,
    Unknown,
}

#[derive(strum::Display)]
pub enum Framework {
    // instead of serializing as NodeTs, I want to serialize as Nest
    NodeNest,
    NodeExpress,
    Tauri,
    Unknown,
}
