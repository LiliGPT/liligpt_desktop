use serde::{Deserialize, Serialize};

use crate::code_missions_api::{MissionData, MissionExecutionContextFile};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExecuteMissionRequest {
    mission_id: String,
    mission_data: MissionData,
    context_files: Vec<MissionExecutionContextFile>,
}
