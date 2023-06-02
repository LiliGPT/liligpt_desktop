#[tauri::command]
pub async fn get_test_scripts(project_dir: String) -> Result<impl serde::Serialize, String> {
    let test_scripts =
        crate::code_analyst::get_test_scripts(project_dir).expect("error getting test scripts");
    return Ok(test_scripts);
}
