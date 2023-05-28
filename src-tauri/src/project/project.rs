pub struct Project {
    project_dir: String,
}

impl Project {
    pub async fn new_from_directory(project_dir: &str) -> Self {
        Self {
            project_dir: project_dir.to_owned(),
        }
    }

    fn get_code_language(&self) -> Result<String, String> {
        return Ok(
            crate::code_analyst::code_language::detect_code_language_from_path(&self.project_dir)?,
        );
    }

    fn get_framework(&self) -> Result<String, String> {
        return Ok(crate::code_analyst::framework::detect_framework_from_path(
            &self.project_dir,
        )?);
    }

    pub fn to_json(&self) -> Result<impl serde::Serialize, String> {
        // todo: should be a project where we can save in database?
        return Ok(serde_json::json!({
          "project_dir": &self.project_dir,
          "code_language": self.get_code_language()?,
          "framework": self.get_framework()?,
        }));
    }
}
