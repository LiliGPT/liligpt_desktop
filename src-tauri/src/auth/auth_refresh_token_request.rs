use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuthRefreshTokenRequest {
    pub refresh_token: String,
}
