use serde::{Deserialize, Serialize};

use super::MissionActionType;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MissionAction {
    pub action_type: MissionActionType,
    pub path: String,
    pub content: String,
}
