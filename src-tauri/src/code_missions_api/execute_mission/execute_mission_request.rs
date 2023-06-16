use serde::{Deserialize, Serialize};

use crate::code_missions_api::{MissionData, MissionExecutionContextFile};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExecuteMissionRequest {
    pub mission_id: String,
    pub mission_data: MissionData,
    pub context_files: Vec<MissionExecutionContextFile>,
}
