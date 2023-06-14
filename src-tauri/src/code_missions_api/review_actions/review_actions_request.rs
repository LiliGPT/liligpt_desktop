use serde::{Deserialize, Serialize};

use crate::code_missions_api::MissionAction;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReviewActionsRequest {
    pub execution_id: String,
    pub actions: Vec<MissionAction>,
}
