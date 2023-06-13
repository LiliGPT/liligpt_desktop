use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MissionExecutionContextFile {
    pub path: String,
    pub content: String,
}
