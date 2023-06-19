use crate::{
    auth::{auth_refresh_token, AuthRefreshTokenRequest},
    configjson,
};

#[tauri::command]
pub async fn auth_refresh_token_command(
    request: AuthRefreshTokenRequest,
) -> Result<impl serde::Serialize, String> {
    // configjson::set("auth.username", &request.username)?;
    // configjson::set("auth.password", &request.password)?;
    let response = auth_refresh_token(request).await?;
    Ok(response)
}
