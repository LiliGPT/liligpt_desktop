#[derive(serde::Serialize)]
struct Test {}

#[tauri::command]
pub async fn run_shell_command(
    cwd: String,
    command: String,
) -> Result<impl serde::Serialize, String> {
    // new version
    // let vec_command = command.split(" ").collect::<Vec<&str>>();
    // let output = std::process::Command::new(vec_command[0])
    //     .args(&vec_command[1..])
    //     .current_dir(cwd)
    //     .output()
    //     .expect(format!("failed to execute command: {}", command).as_str());
    // old version
    let output = std::process::Command::new("bash")
        .arg("-c")
        .arg(&command)
        .current_dir(cwd)
        .output()
        .expect(format!("failed to execute command: {}", command).as_str());
    if output.status.success() {
        let stdout = String::from_utf8(output.stdout).unwrap();
        // let stdout = parse_stdout_string(stdout);
        return Ok(stdout);
    }
    let stderr = String::from_utf8(output.stderr).unwrap();
    // let stderr = parse_error_message(stderr);
    Err(stderr)
}
