use super::super::types;

pub fn get_subprojects(path: &str) -> Vec<types::SubprojectDescriptor> {
    let read_dir = std::fs::read_dir(path).ok();
    if read_dir.is_none() {
        return vec![];
    }
    let read_dir = read_dir.unwrap();

    let mut subprojects: Vec<types::SubprojectDescriptor> = vec![];
    for entry in read_dir {
        if let Some(entry) = entry.ok() {
            let filepath = entry.path();
            if filepath.is_dir() {
                if let Some(subproject) = get_subproject(filepath).ok() {
                    subprojects.push(subproject);
                }
            }
        }
    }
    return subprojects;
}

fn get_subproject(filepath: std::path::PathBuf) -> Result<types::SubprojectDescriptor, String> {
    let package_json_path = filepath.join("package.json");
    if !package_json_path.exists() {
        return Err("package.json not found".to_string());
    }
    let package_json = std::fs::read_to_string(package_json_path).unwrap();
    let package_json: serde_json::Value = serde_json::from_str(&package_json).unwrap();

    let path = filepath.to_str().unwrap();
    let path_name = path.split("/").last().unwrap();
    let name = package_json["name"]
        .as_str()
        .unwrap_or(path_name)
        .to_owned();

    let code_language = crate::code_analyst::languages::detect_code_language_from_path(path)
        .unwrap_or(types::CodeLanguage::Unknown);
    let framework =
        crate::code_analyst::frameworks::detect_framework_from_path(path, &code_language);

    let subproject = types::SubprojectDescriptor {
        name,
        path: filepath.to_str().unwrap().to_owned(),
        code_language,
        framework,
    };
    return Ok(subproject);
}
