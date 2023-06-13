mod javascript;

use super::types;

pub fn get_subprojects(
    path: &str,
    code_language: &types::CodeLanguage,
    _framework: &types::Framework,
) -> Vec<types::SubprojectDescriptor> {
    match code_language {
        types::CodeLanguage::Javascript => javascript::get_subprojects(path),
        _ => vec![],
    }
}
