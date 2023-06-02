#[tauri::command]
pub async fn install_dependencies(cwd: String) -> Result<impl serde::Serialize, String> {
    crate::code_analyst::install_dependencies(cwd);
    Ok(())
}
