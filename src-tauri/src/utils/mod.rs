pub mod package_json {
    pub struct PackageJsonDependency {
        pub name: String,
        pub version: String,
        pub is_dev: bool,
    }

    pub fn get_dependency_version(
        project_dir: &str,
        dependency_name: &str,
    ) -> Result<PackageJsonDependency, Box<dyn std::error::Error>> {
        let package_json = std::fs::read_to_string(format!("{}/package.json", project_dir))?;
        let package_json: serde_json::Value = serde_json::from_str(&package_json)?;
        let dependencies = package_json["dependencies"].as_object();
        let dev_dependencies = package_json["devDependencies"].as_object();
        if dependencies.is_none() && dev_dependencies.is_none() {
            return Err("no dependencies found".into());
        }
        let empty = serde_json::Map::new();
        let dependencies = match dependencies {
            Some(dependencies) => dependencies,
            None => &empty,
        };
        let dev_dependencies = match dev_dependencies {
            Some(dev_dependencies) => dev_dependencies,
            None => &empty,
        };
        let dependency_version = dependencies.get(dependency_name);
        match dependency_version {
            Some(dependency_version) => Ok(PackageJsonDependency {
                name: dependency_name.to_string(),
                version: dependency_version.as_str().unwrap().to_string(),
                is_dev: false,
            }),
            None => {
                let dependency_version = dev_dependencies.get(dependency_name);
                match dependency_version {
                    Some(dependency_version) => {
                        return Ok(PackageJsonDependency {
                            name: dependency_name.to_string(),
                            version: dependency_version.as_str().unwrap().to_string(),
                            is_dev: true,
                        })
                    }
                    None => return Err("dependency not found".into()),
                }
            }
        }
    }
}
