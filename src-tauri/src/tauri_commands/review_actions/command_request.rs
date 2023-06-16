use serde::{Deserialize, Serialize};

use crate::code_missions_api::MissionAction;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CommandRequest {
    pub execution_id: String,
    pub reviewed_actions: Vec<MissionAction>,
}
