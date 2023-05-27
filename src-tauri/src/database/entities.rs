pub struct Project {
    project_dir: String,
}

impl Project {
    pub fn new(project_dir: String) -> Self {
        Self {
            project_dir: project_dir,
        }
    }
    pub fn to_json(&self) -> serde_json::Value {
        return serde_json::json!({
          "project_dir": self.project_dir,
        });
    }
}
