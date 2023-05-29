pub fn detect_nodejs(project_dir: &str) -> Result<(), Box<dyn std::error::Error>> {
    // check if package.json exists
    let package_json_exists = std::path::Path::new(project_dir)
        .join("package.json")
        .exists();
    if package_json_exists == false {
        return Err("No package.json found".into());
    }
    Ok(())
}
