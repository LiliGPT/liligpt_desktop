#[tauri::command]
pub async fn get_test_scripts(
    project_dir: String,
) -> Result<serde_json::Map<String, serde_json::Value>, String> {
    let test_scripts = crate::code_analyst::get_test_scripts(project_dir);
    match test_scripts {
        Ok(test_scripts) => Ok(test_scripts),
        Err(_) => Ok(serde_json::Map::new()),
    }
}
