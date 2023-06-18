use crate::{
    auth::{auth_login, AuthLoginRequest},
    configjson,
};

#[tauri::command]
pub async fn auth_login_command(
    request: AuthLoginRequest,
) -> Result<impl serde::Serialize, String> {
    // configjson::set("auth.username", &request.username)?;
    // configjson::set("auth.password", &request.password)?;
    let response = auth_login(request).await?;
    Ok(response)
}
