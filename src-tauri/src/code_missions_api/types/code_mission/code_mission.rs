use serde::{Deserialize, Serialize};

use crate::code_missions_api::MissionData;

use super::CodeMissionStatus;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CodeMission {
    pub mission_id: String,
    pub mission_status: CodeMissionStatus,
    pub mission_data: MissionData,
    pub created_at: String,
    pub updated_at: Option<String>,
}
