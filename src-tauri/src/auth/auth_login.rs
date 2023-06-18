use crate::configjson;

use super::{AuthLoginRequest, AuthLoginResponse};

pub async fn auth_login(request: AuthLoginRequest) -> Result<AuthLoginResponse, String> {
    let client = reqwest::Client::new();
    let login_endpoint = "https://liligpt-auth.giovannefeitosa.com/auth/realms/liligpt/protocol/openid-connect/token";
    let response = client
        .post(login_endpoint)
        .form(&[
            ("grant_type", "password"),
            ("client_id", "liligpt_backend"),
            ("client_secret", "7fc42eea-3b13-4f5f-ac8e-0c68c934475a"),
            ("username", &request.username),
            ("password", &request.password),
        ])
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(error) => return Err(format!("Failed to send request to auth server: {}", error)),
    };
    println!("Response: {:?}", &response);
    // let response = match response.json::<AuthLoginResponse>().await {
    //     Ok(response) => response,
    //     Err(error) => {
    //         return Err(format!(
    //             "Failed to parse response from auth server: {}",
    //             error
    //         ))
    //     }
    // };
    let response = match response.text().await {
        Ok(response) => response,
        Err(error) => {
            return Err(format!(
                "Failed to parse text response from auth server: {}",
                error
            ))
        }
    };
    let final_response = match serde_json::from_str::<AuthLoginResponse>(&response) {
        Ok(response) => response,
        Err(error) => {
            return Err(format!(
                "Failed to parse json response from auth server: {}",
                error
            ))
        }
    };
    configjson::set("access_token", &final_response.access_token);
    configjson::set("refresh_token", &final_response.refresh_token);
    Ok(final_response)
}
