pub fn get_test_scripts(project_dir: String) -> Result<impl serde::Serialize, String> {
    let package_json = std::fs::read_to_string(&format!("{}/package.json", project_dir))
        .expect("error reading package.json");
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
        // scriptValue contains the word "jest"
        .filter(|(_, value)| value.to_string().contains("jest"))
        // scriptValue does not contains the word "watch"
        .filter(|(_, value)| !value.to_string().contains("watch"))
        .map(|(key, value)| (key.to_owned(), value.to_owned()))
        // if the script does not have "--coverage", let's add
        .map(|(key, value)| {
            if !value.to_string().contains("--coverage") {
                let value_string = format!("{} --coverage", value.to_string());
                let value = serde_json::Value::String(value_string);
                (key.to_owned(), value)
            } else {
                (key.to_owned(), value.to_owned())
            }
        })
        .collect::<serde_json::Map<String, serde_json::Value>>();
    return Ok(test_scripts);
}
