use serde::{Deserialize, Serialize};

use crate::code_missions_api::{MissionAction, MissionExecutionStatus};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExecuteMissionResponse {
    pub execution_id: String,
    pub mission_id: String,
    pub execution_status: MissionExecutionStatus,
    pub original_actions: Vec<MissionAction>,
}
