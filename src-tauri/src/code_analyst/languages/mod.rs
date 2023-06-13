pub mod javascript;

pub fn detect_code_language_from_path(
    project_dir: &str,
) -> Result<super::types::CodeLanguage, String> {
    // Javascript: NodeTs
    let nodets = crate::code_analyst::languages::javascript::detect_nodets(project_dir);
    if nodets.is_ok() {
        return Ok(super::types::CodeLanguage::Javascript);
    }
    // Javascript: NodeJs
    let nodejs = crate::code_analyst::languages::javascript::detect_nodejs(project_dir);
    if nodejs.is_ok() {
        return Ok(super::types::CodeLanguage::Javascript);
    }
    Ok(super::types::CodeLanguage::Unknown)
}
