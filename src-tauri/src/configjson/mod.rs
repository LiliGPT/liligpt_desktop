use std::path::Path;

pub fn set(key: &str, value: &str) -> Result<(), String> {
    let path = Path::new("/home/l/.lili/config.json");
    if !path.is_file() {
        std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        std::fs::write(path, "{}").unwrap();
    }
    let content = std::fs::read_to_string(path).unwrap();
    let mut content: serde_json::Value = serde_json::from_str(&content).unwrap();
    content[key] = serde_json::Value::String(value.to_string());
    let content = serde_json::to_string_pretty(&content).unwrap();
    std::fs::write(path, content).unwrap();
    Ok(())
}

pub fn get(key: &str) -> Option<String> {
    let path = Path::new("/home/l/.lili/config.json");
    if !path.is_file() {
        std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        std::fs::write(path, "{}").unwrap();
    }
    let content = std::fs::read_to_string(path).unwrap();
    let content: serde_json::Value = serde_json::from_str(&content).unwrap();
    let value = content.get(key)?;
    let value = value.as_str()?;
    Some(value.to_string())
}
