use serde::{Deserialize, Serialize};

use crate::code_missions_api::MissionData;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateMissionRequest {
    pub mission_data: MissionData,
}
