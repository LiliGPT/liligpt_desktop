use crate::shell::run_shell_command;

pub fn git_add_changes(project_dir: &str) -> Result<(), String> {
    let commands = vec!["git add ."];
    for command in commands {
        let result = run_shell_command(command, project_dir);
        if !result.stderr.is_empty() {
            return Err(format!(
                "Error executing command: '{}'\n{}\n",
                command, result.stderr
            ));
        }
    }
    Ok(())
}
