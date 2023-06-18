pub struct JsonFile {
    path: String,
    content: Result<serde_json::Value, String>,
}

impl JsonFile {
    pub fn open(path: &str) -> Result<Self, String> {
        let content = std::fs::read_to_string(&path);
        let content = match content {
            Ok(content) => match serde_json::from_str::<serde_json::Value>(&content) {
                Ok(content) => Ok(content),
                Err(error) => Err(error.to_string()),
            },
            Err(error) => Err(error.to_string()),
        };
        Ok(Self {
            path: path.to_string(),
            content: content,
        })
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

    pub fn set(&mut self, key: &str, value: &str) -> Result<(), String> {
        let content = self.content.as_mut();
        let mut content = match content {
            Ok(content) => content,
            Err(_) => return Err("Invalid JSON".to_string()),
        };
        let mut keys = key.split('.');
        let last_key = keys.next_back().unwrap();
        for key in keys {
            match content.get_mut(key) {
                Some(value) => {
                    content = value;
                }
                None => return Err("Invalid key".to_string()),
            };
        }
        content[last_key] = serde_json::Value::String(value.to_string());
        Ok(())
    }

    pub fn save(&self) -> Result<(), String> {
        let content = match &self.content {
            Ok(content) => content,
            Err(_) => return Err("Invalid JSON".to_string()),
        };
        let content = match serde_json::to_string_pretty(content) {
            Ok(content) => content,
            Err(error) => return Err(error.to_string()),
        };
        match std::fs::write(&self.path, content) {
            Ok(_) => Ok(()),
            Err(error) => Err(error.to_string()),
        }
    }
}
