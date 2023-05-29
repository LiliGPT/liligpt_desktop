pub fn detect_framework_from_path(
    project_dir: &str,
    language: &super::types::CodeLanguage,
) -> super::types::Framework {
    match language {
        super::types::CodeLanguage::NodeJs => {
            // todo: javascript should be different
            let framework = super::frameworks::nodets::detect_nodets_framework(project_dir);
            if let Some(framework) = framework {
                return framework;
            }
        }
        super::types::CodeLanguage::NodeTs => {
            let framework = super::frameworks::nodets::detect_nodets_framework(project_dir);
            if let Some(framework) = framework {
                return framework;
            }
        }
        super::types::CodeLanguage::Unknown => {
            return super::types::Framework::Unknown;
        }
    }
    super::types::Framework::Unknown
}
