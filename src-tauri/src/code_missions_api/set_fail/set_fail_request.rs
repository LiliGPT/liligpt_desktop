use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SetFailRequest {
    pub execution_id: String,
}
