use serde::{Deserialize, Serialize};

use crate::code_missions_api::CodeMissionStatus;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateMissionResponse {
    pub mission_id: String,
    pub mission_status: CodeMissionStatus,
    pub context_files: Vec<String>,
}
