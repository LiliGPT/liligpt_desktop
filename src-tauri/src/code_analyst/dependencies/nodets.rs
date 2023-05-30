pub fn is_dependencies_installed(project_path: &str) -> bool {
    // check if folder node_modules exists
    let node_modules_path = project_path.to_string() + "/node_modules";
    let node_modules_path = std::path::Path::new(&node_modules_path);
    if false == node_modules_path.exists() {
        return false;
    };
    return true;
}

pub fn install_dependencies(project_path: &str) -> Result<(), String> {
    // check if package.json exists
    let package_json_path = project_path.to_string() + "/package.json";
    let package_json_path = std::path::Path::new(&package_json_path);
    if false == package_json_path.exists() {
        return Err("package.json not found".to_string());
    };
    // install dependencies
    let output = std::process::Command::new("npm")
        .arg("install")
        .current_dir(project_path)
        .output()
        .expect("failed to install dependencies");
    if false == output.status.success() {
        return Err("failed to install dependencies, error code not 0".to_string());
    };
    // return ok
    Ok(())
}
