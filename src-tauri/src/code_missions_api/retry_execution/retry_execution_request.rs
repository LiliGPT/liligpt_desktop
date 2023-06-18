use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RetryExecutionRequest {
    pub execution_id: String,
    pub message: String,
}
