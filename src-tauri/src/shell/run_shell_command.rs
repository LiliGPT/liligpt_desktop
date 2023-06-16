use std::process::Command;

pub struct RunShellCommandResult {
    pub stdout: String,
    pub stderr: String,
}

pub fn run_shell_command(command: &str, cwd: &str) -> RunShellCommandResult {
    let mut command = command.split_whitespace();
    let command_name = command.next().unwrap();
    let command_args = command.collect::<Vec<&str>>();
    let output = Command::new(command_name)
        .args(command_args)
        .current_dir(cwd)
        .output()
        .expect("failed to execute process");
    let stdout = String::from_utf8(output.stdout).unwrap();
    let stderr = String::from_utf8(output.stderr).unwrap();
    RunShellCommandResult { stdout, stderr }
}
