use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum CodeMissionStatus {
    Created,
    Fail,
    Perfect,
}
