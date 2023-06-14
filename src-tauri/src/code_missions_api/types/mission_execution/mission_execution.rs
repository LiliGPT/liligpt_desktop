use serde::{Deserialize, Serialize};

use crate::code_missions_api::{
    MissionAction, MissionData, MissionExecutionContextFile, MissionExecutionStatus,
};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MissionExecution {
    pub execution_id: String,
    pub mission_id: String,
    pub execution_status: MissionExecutionStatus,
    pub mission_data: MissionData,
    pub context_files: Vec<MissionExecutionContextFile>,
    pub original_actions: Vec<MissionAction>,
    pub reviewed_actions: Option<Vec<MissionAction>>,
    pub created_at: String,
    pub updated_at: Option<String>,
}
