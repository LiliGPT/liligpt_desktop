use serde::{Deserialize, Serialize};
use strum::Display;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Display)]
pub enum MissionActionType {
    CreateFile,
    UpdateFile,
}
