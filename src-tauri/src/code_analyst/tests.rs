pub fn get_test_scripts(
    project_dir: String,
) -> Result<serde_json::Map<String, serde_json::Value>, String> {
    let package_json_path = format!("{}/package.json", project_dir);
    if !std::path::Path::new(&package_json_path).exists() {
        return Err("package.json not found".to_string());
    }
    let package_json =
        std::fs::read_to_string(&package_json_path).expect("error reading package.json");
    let package_json: serde_json::Value =
        serde_json::from_str(&package_json).expect("error parsing package.json");
    let test_scripts = package_json["scripts"].to_owned();
    // filter test_scripts to only include scripts that start with "test"
    let test_scripts = test_scripts
        .as_object()
        .unwrap()
        .iter()
        // scriptKey starts with "test"
        .filter(|(key, _)| key.starts_with("test"))
        // scriptKey is different than "test:cov"
        .filter(|(key, _)| key.to_string() != "test:cov")
        // scriptValue contains the word "jest"
        .filter(|(_, value)| value.to_string().contains("jest"))
        // scriptValue does not contains the word "watch"
        .filter(|(_, value)| !value.to_string().contains("watch"))
        // convert to string for the next operations
        .map(|(key, value)| (key.to_owned(), value.as_str().unwrap().to_owned()))
        // replace " jest" with " ./node_modules/.bin/jest" in scriptValue
        .map(|(key, value)| {
            let re = regex::Regex::new(r"^(jest)|(\s+jest)").unwrap();
            let value = re
                .replace_all(&value, " ./node_modules/.bin/jest")
                .into_owned();
            (key, value)
        })
        // if the script does not have "--coverage", let's add
        .map(|(key, value)| {
            if !value.contains("--coverage") {
                let value = format!("{} --coverage", value);
                (key, value)
            } else {
                (key, value)
            }
        })
        // if the script does not have "--no-colors", let's add
        .map(|(key, value)| {
            if !value.contains("--no-colors") {
                let value = format!("{} --no-colors", value);
                (key, value)
            } else {
                (key, value)
            }
        })
        // convert back to serde_json::Value
        .map(|(key, value)| {
            let value = serde_json::Value::String(value);
            (key, value)
        })
        .collect::<serde_json::Map<String, serde_json::Value>>();
    return Ok(test_scripts);
}
