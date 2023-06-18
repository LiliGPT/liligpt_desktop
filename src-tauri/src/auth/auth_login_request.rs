use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuthLoginRequest {
    pub username: String,
    pub password: String,
}
