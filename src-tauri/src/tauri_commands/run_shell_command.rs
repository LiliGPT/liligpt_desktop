#[derive(serde::Serialize)]
struct Test {}

#[tauri::command]
pub async fn run_shell_command(
    cwd: String,
    command: String,
) -> Result<impl serde::Serialize, String> {
    // todo next
    // - create this run_shell_command
    // - call this run_shell_command from the frontend (inside a foreach testScript) - redux/slices/currentTesting.js @ 89
    // doing
    // this output was not considering cwd
    // let output = std::process::Command::new("bash")
    //     .arg("-c")
    //     .arg(&command)
    //     .output()
    //     .expect(format!("failed to execute command: {}", command).as_str());
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
    let stderr = parse_error_message(stderr);
    Err(stderr)
}

fn parse_error_message(stdout: String) -> String {
    // let re = stdout.split_whitespace().nth(1).unwrap();
    // re.to_owned()
    let start_index = match stdout.find("FAIL") {
        Some(index) => index,
        None => {
            return stdout;
        }
    };

    let end_index = match stdout.find("●") {
        Some(index) => index,
        None => stdout.len(),
    };

    let value = &stdout[start_index..end_index];
    value.to_owned()
}
