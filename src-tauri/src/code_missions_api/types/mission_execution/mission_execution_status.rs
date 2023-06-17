use serde::{Deserialize, Serialize};
use strum::Display;

#[derive(Debug, Clone, Serialize, Deserialize, Display, PartialEq)]
pub enum MissionExecutionStatus {
    Created,
    Approved,
    Fail,
    Ok,
    Perfect,
}
