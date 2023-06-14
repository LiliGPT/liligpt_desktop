use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SetPerfectRequest {
    pub execution_id: String,
}
