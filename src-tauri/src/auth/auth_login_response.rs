use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuthLoginResponse {
    pub access_token: String,
    pub refresh_token: String,
}
