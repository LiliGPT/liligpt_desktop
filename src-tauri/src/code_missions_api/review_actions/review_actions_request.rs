use serde::{Deserialize, Serialize};

use crate::code_missions_api::{MissionAction, MissionExecutionContextFile};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReviewActionsRequest {
    pub execution_id: String,
    pub reviewed_actions: Vec<MissionAction>,
    pub context_files: Option<Vec<MissionExecutionContextFile>>,
}
