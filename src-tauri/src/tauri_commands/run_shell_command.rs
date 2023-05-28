#[tauri::command]
pub async fn run_shell_command(project_dir: String) -> Result<impl serde::Serialize, String> {
    // todo next
    // - create this run_shell_command
    // - call this run_shell_command from the frontend (inside a foreach testScript) - redux/slices/currentTesting.js @ 89
    Ok("run_shell_command")
}
