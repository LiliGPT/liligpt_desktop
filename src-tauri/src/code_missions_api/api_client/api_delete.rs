use serde_json::json;

use super::ApiError;

pub async fn api_delete(access_token: &str, uri: &str) -> Result<(), ApiError> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .delete(&format!("{}{}", dotenv!("PROMPTER_URL"), uri))
        .bearer_auth(access_token)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(err) => {
            return Err(ApiError::from(
                err,
                format!("Failed to send request to POST {}", uri).as_str(),
            ))
        }
    };
    match response.status() {
        reqwest::StatusCode::OK => Ok(()),
        reqwest::StatusCode::NO_CONTENT => Ok(()),
        _ => {
            let response_status = response.status().as_u16() as i32;
            let response_text = &response.text().await.unwrap_or("Unknown error".to_string());
            Err(ApiError {
                status_code: response_status,
                message: response_text.to_string(),
            })
        }
    }
}
