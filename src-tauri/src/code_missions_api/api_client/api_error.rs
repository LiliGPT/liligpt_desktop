use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub status_code: i32,
    pub message: String,
}

impl ApiError {
    pub fn from(error: reqwest::Error, message: &str) -> Self {
        let status_code = match error.status() {
            Some(status) => status.as_u16() as i32,
            None => 0,
        };
        let message = format!("{}: {}", message, error.to_string());
        ApiError {
            status_code,
            message,
        }
    }
}
