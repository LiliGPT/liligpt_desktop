pub mod dependencies;
pub mod frameworks;
pub mod languages;
pub mod subprojects;
pub mod tests;
pub mod types;

pub use types::*;

pub use tests::get_test_scripts;

pub fn get_path_info(path: &str) -> Result<types::PathInfo, String> {
    let code_language =
        languages::detect_code_language_from_path(path).unwrap_or(types::CodeLanguage::Unknown);
    let framework = frameworks::detect_framework_from_path(path, &code_language);
    let dependencies_installed =
        frameworks::is_dependencies_installed(path, &code_language).unwrap_or(false);
    let local_server_commands =
        frameworks::get_local_server_commands(path, &code_language, &framework).unwrap_or(vec![]);
    let subprojects = subprojects::get_subprojects(path, &code_language, &framework);

    // return Ok(serde_json::json!({
    //   "project_dir": path,
    //   "code_language": code_language.to_string(),
    //   "framework": framework.to_string(),
    //   "dependencies_installed": dependencies_installed,
    //   "local_server_commands": local_server_commands,
    //   "subprojects": subprojects,
    // }));
    Ok(types::PathInfo {
        project_dir: path.to_string(),
        code_language,
        framework,
        dependencies_installed,
        local_server_commands,
        subprojects,
    })
}

pub fn install_dependencies(cwd: String) -> Result<impl serde::Serialize, String> {
    let test_scripts = dependencies::nodets::install_dependencies(&cwd);
    match test_scripts {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
