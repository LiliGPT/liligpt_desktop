use super::ApiError;

pub async fn api_get<Response: serde::de::DeserializeOwned>(
    access_token: &str,
    uri: &str,
) -> Result<Option<Response>, ApiError> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .get(&format!("{}{}", dotenv!("PROMPTER_URL"), uri))
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
        reqwest::StatusCode::OK => {
            let response_json = match response.json().await {
                Ok(resp) => resp,
                Err(err) => {
                    return Err(ApiError::from(
                        err,
                        "Failed to parse response as a MissionExecution",
                    ))
                }
            };
            Ok(response_json)
        }
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
