pub struct JsonFile {
    // path: String,
    content: Result<serde_json::Value, String>,
}

impl JsonFile {
    pub fn new(path: &str) -> Self {
        let content = std::fs::read_to_string(path);
        let content = match content {
            Ok(content) => match serde_json::from_str::<serde_json::Value>(&content) {
                Ok(content) => Ok(content),
                Err(error) => Err(error.to_string()),
            },
            Err(error) => Err(error.to_string()),
        };
        Self {
            // path: path.to_string(),
            content: content,
        }
    }

    // pub fn is_valid(&self) -> bool {
    //     match &self.content {
    //         Ok(_) => true,
    //         Err(_) => false,
    //     }
    // }

    /// uri is a dot separated path to the desired value
    pub fn get(&self, uri: &str) -> Option<&serde_json::Value> {
        let content = self.content.as_ref();
        let mut content = match content {
            Ok(content) => content,
            Err(_) => return None,
        };
        for key in uri.split('.') {
            match content.get(key) {
                Some(value) => {
                    content = value;
                }
                None => return None,
            };
        }
        Some(content)
    }
}
