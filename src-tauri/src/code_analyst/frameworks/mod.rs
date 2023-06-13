pub mod nodets;

pub fn detect_framework_from_path(
    project_dir: &str,
    language: &super::types::CodeLanguage,
) -> super::types::Framework {
    match language {
        super::types::CodeLanguage::Javascript => {
            // todo: javascript should be different
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
        super::types::CodeLanguage::Javascript => {
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
    // read projectJson at project_dir
    match code_language {
        super::types::CodeLanguage::Javascript => Ok(node_commands(project_dir).unwrap_or(vec![])),
        super::types::CodeLanguage::Unknown => Ok(vec![]),
    }
}

fn node_commands(project_dir: &str) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let project_json =
        std::fs::read_to_string(std::path::Path::new(project_dir).join("package.json")).unwrap();
    let project_json: serde_json::Value = serde_json::from_str(&project_json)?;
    let project_json_scripts = &project_json["scripts"]
        .as_object()
        .expect("invalid Package.json scripts")
        .to_owned();
    let mut commands = vec![];
    for (key, value) in project_json_scripts {
        let is_start = key.contains("start");
        let is_dev = key.contains("dev");
        if is_start == true || is_dev == true {
            commands.push(format!("npm run {}", key));
        }
    }
    Ok(commands)
}
