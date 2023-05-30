#[tauri::command]
pub async fn install_dependencies(cwd: String) -> Result<impl serde::Serialize, String> {
    let test_scripts = crate::code_analyst::dependencies::nodets::install_dependencies(&cwd)
        .expect("error getting test scripts");
    return Ok(test_scripts);
}
