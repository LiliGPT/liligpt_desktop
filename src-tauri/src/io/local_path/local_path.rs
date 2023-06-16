use std::path::Path;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct LocalPath(pub String);

impl LocalPath {
    pub fn as_path(&self) -> &Path {
        Path::new(&self.0)
    }

    pub fn to_string(&self) -> String {
        self.0.clone()
    }
}
