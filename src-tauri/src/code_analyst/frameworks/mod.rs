pub mod nodets;

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

pub fn is_dependencies_installed(
    project_dir: &str,
    language: &super::types::CodeLanguage,
) -> Result<bool, String> {
    match language {
        super::types::CodeLanguage::NodeJs => {
            return Ok(super::dependencies::nodets::is_dependencies_installed(
                project_dir,
            ));
        }
        super::types::CodeLanguage::NodeTs => {
            return Ok(super::dependencies::nodets::is_dependencies_installed(
                project_dir,
            ));
        }
        super::types::CodeLanguage::Unknown => {
            return Err("unknown language".to_string());
        }
    }
}

pub fn get_local_server_commands(
    project_dir: &str,
    code_language: &super::types::CodeLanguage,
    framework: &super::types::Framework,
) -> Result<Vec<String>, String> {
    match framework {
        super::types::Framework::NodeNest => Ok(vec!["npm run start:dev".to_string()]),
        _ => Err("unknown server command".to_string()),
    }
}
