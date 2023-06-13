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

pub fn detect_nodets(project_dir: &str) -> Result<(), Box<dyn std::error::Error>> {
    // check if package.json exists
    let package_json_exists = std::path::Path::new(project_dir)
        .join("package.json")
        .exists();
    if package_json_exists == false {
        return Err("No package.json found".into());
    }
    // // get package.json dependencies
    // let package_json =
    //     std::fs::read_to_string(std::path::Path::new(project_dir).join("package.json"))?;
    // let package_json: serde_json::Value = serde_json::from_str(&package_json)?;
    // let package_json_dependencies = &package_json["dependencies"]
    //     .as_object()
    //     .expect("invalid Package.json dependencies")
    //     .to_owned();
    // let package_json_dev_dependencies = &package_json["devDependencies"]
    //     .as_object()
    //     .expect("invalid Package.json devDependencies")
    //     .to_owned();
    // // check if package.json contains typescript
    // let typescript_exists = package_json_dependencies.contains_key("typescript")
    //     || package_json_dev_dependencies.contains_key("typescript");
    // if typescript_exists == false {
    //     return Err("No typescript dependency found".into());
    // }
    // // check if package.json contains @types/node
    // let types_node_exists = package_json_dependencies.contains_key("@types/node")
    //     || package_json_dev_dependencies.contains_key("@types/node");
    // if types_node_exists == false {
    //     return Err("No @types/node dependency found".into());
    // }
    crate::utils::package_json::get_dependency_version(project_dir, "typescript")?;
    crate::utils::package_json::get_dependency_version(project_dir, "@types/node")?;
    Ok(())
}
