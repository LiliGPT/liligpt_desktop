pub fn detect_code_language_from_path(
    project_dir: &str,
) -> Result<super::types::CodeLanguage, String> {
    // NodeTs
    let nodets = crate::code_analyst::languages::nodets::detect_nodets(project_dir);
    if nodets.is_ok() {
        return Ok(super::types::CodeLanguage::NodeTs);
    }
    // NodeJs
    let nodejs = crate::code_analyst::languages::nodejs::detect_nodejs(project_dir);
    if nodejs.is_ok() {
        return Ok(super::types::CodeLanguage::NodeJs);
    }
    Ok(super::types::CodeLanguage::Unknown)
}
