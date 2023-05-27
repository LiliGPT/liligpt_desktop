pub fn detect_framework_from_path(project_dir: &str) -> Result<String, String> {
    let is_nestjs_project = crate::frameworks::nestjs::validator::is_valid_project(project_dir);
    if is_nestjs_project.is_err() {
        return Err(is_nestjs_project.err().unwrap().to_string());
    }
    return Ok("nestjs".into());
}
