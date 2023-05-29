pub fn detect_nodets_framework(project_dir: &str) -> Option<crate::code_analyst::types::Framework> {
    let is_nest = is_valid_nest_project(project_dir);
    if is_nest.is_ok() {
        return Some(crate::code_analyst::types::Framework::NodeNest);
    }
    let is_express = is_valid_express_project(project_dir);
    if is_express.is_ok() {
        return Some(crate::code_analyst::types::Framework::NodeExpress);
    }
    let is_tauri = is_valid_tauri_project(project_dir);
    if is_tauri.is_ok() {
        return Some(crate::code_analyst::types::Framework::Tauri);
    }
    None
}

fn is_valid_nest_project(project_path: &str) -> Result<(), String> {
    // check if package.json exists
    let package_json_path = project_path.to_string() + "/package.json";
    let package_json_path = std::path::Path::new(&package_json_path);
    if false == package_json_path.exists() {
        return Err("package.json not found".to_string());
    };
    // read package.json
    let package_json_content = std::fs::read_to_string(package_json_path).unwrap();
    let package_json = serde_json::from_str::<serde_json::Value>(&package_json_content).unwrap();
    let dependencies = package_json["dependencies"].as_object();
    if dependencies.is_none() {
        return Err("Invalid package.json".to_string());
    };
    let dependencies = dependencies.unwrap();
    // check if package.json has nestjs dependency
    if false == dependencies.contains_key("@nestjs/core") {
        return Err("@nestjs/core dependency not found".to_string());
    };
    // return ok
    Ok(())
}

fn is_valid_express_project(project_path: &str) -> Result<(), String> {
    // check if package.json exists
    let package_json_path = project_path.to_string() + "/package.json";
    let package_json_path = std::path::Path::new(&package_json_path);
    if false == package_json_path.exists() {
        return Err("package.json not found".to_string());
    };
    // read package.json
    let package_json_content = std::fs::read_to_string(package_json_path).unwrap();
    let package_json = serde_json::from_str::<serde_json::Value>(&package_json_content).unwrap();
    let dependencies = package_json["dependencies"].as_object();
    if dependencies.is_none() {
        return Err("Invalid package.json".to_string());
    };
    let dependencies = dependencies.unwrap();
    // check if package.json has express dependency
    if false == dependencies.contains_key("express") {
        return Err("express dependency not found".to_string());
    };
    // return ok
    Ok(())
}

fn is_valid_tauri_project(project_path: &str) -> Result<(), String> {
    // check if package.json exists
    let package_json_path = project_path.to_string() + "/package.json";
    let package_json_path = std::path::Path::new(&package_json_path);
    if false == package_json_path.exists() {
        return Err("package.json not found".to_string());
    };
    // read package.json
    let package_json_content = std::fs::read_to_string(package_json_path).unwrap();
    let package_json = serde_json::from_str::<serde_json::Value>(&package_json_content).unwrap();
    let dependencies = package_json["dependencies"].as_object();
    if dependencies.is_none() {
        return Err("Invalid package.json".to_string());
    };
    let dependencies = dependencies.unwrap();
    // check if package.json has express dependency
    if false == dependencies.contains_key("@tauri-apps/api") {
        return Err("@tauri-apps/api dependency not found".to_string());
    };
    // return ok
    Ok(())
}
