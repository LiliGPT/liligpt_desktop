pub struct Project {
    project_dir: String,
}

impl Project {
    pub async fn new_from_directory(project_dir: &str) -> Self {
        Self {
            project_dir: project_dir.to_owned(),
        }
    }

    fn get_code_language(&self) -> Result<crate::code_analyst::types::CodeLanguage, String> {
        return Ok(
            crate::code_analyst::languages::detect_code_language_from_path(&self.project_dir)?,
        );
    }

    fn get_framework(
        &self,
        code_language: &crate::code_analyst::types::CodeLanguage,
    ) -> Result<crate::code_analyst::types::Framework, String> {
        return Ok(crate::code_analyst::frameworks::detect_framework_from_path(
            &self.project_dir,
            code_language,
        ));
    }

    fn get_dependencies_installed(
        &self,
        code_language: &crate::code_analyst::types::CodeLanguage,
    ) -> Result<bool, String> {
        return Ok(crate::code_analyst::frameworks::is_dependencies_installed(
            &self.project_dir,
            &code_language,
        )?);
    }

    fn get_local_server_commands(
        &self,
        code_language: &crate::code_analyst::types::CodeLanguage,
        framework: &crate::code_analyst::types::Framework,
    ) -> Vec<String> {
        match crate::code_analyst::frameworks::get_local_server_commands(
            &self.project_dir,
            &code_language,
            &framework,
        ) {
            Ok(commands) => commands,
            Err(err) => vec![],
        }
    }

    pub fn to_json(&self) -> Result<impl serde::Serialize, String> {
        // todo: should be a project where we can save in database?
        let code_language = self.get_code_language()?;
        let framework = self.get_framework(&code_language)?;
        let dependencies_installed = self.get_dependencies_installed(&code_language)?;
        let local_server_commands = self.get_local_server_commands(&code_language, &framework);
        // after adding fields here
        // I should update React
        //
        return Ok(serde_json::json!({
          "project_dir": &self.project_dir,
          "code_language": code_language.to_string(),
          "framework": framework.to_string(),
          "dependencies_installed": dependencies_installed,
          "local_server_commands": local_server_commands,
        }));
    }
}
