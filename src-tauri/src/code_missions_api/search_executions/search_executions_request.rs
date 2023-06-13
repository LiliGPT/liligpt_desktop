use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SearchExecutionsRequest {
    pub filter: serde_json::Value,
}
