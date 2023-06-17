use serde::{Deserialize, Serialize};

use crate::code_missions_api::{MissionAction, MissionExecutionContextFile};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AddContextFilesRequest {
    pub execution_id: String,
    pub context_files: Vec<MissionExecutionContextFile>,
}
