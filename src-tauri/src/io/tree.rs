use std::error::Error;

#[derive(Debug, serde::Serialize)]
pub enum FileType {
    File,
    Directory,
}

#[derive(Debug, serde::Serialize)]
pub struct FileTree {
    name: String,
    file_type: FileType,
    children: Vec<FileTree>,
    abspath: Option<String>,
}

pub fn get_file_tree(path: &str) -> Result<FileTree, Box<dyn Error>> {
    let read_dir = std::fs::read_dir(path)?;
    let ignore = vec!["node_modules", ".git", "devops"];
    let mut tree = FileTree {
        name: std::path::Path::new(path)
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_owned(),
        file_type: FileType::Directory,
        children: vec![],
        abspath: None,
    };
    for entry in read_dir {
        let entry = &entry?;
        let filename = entry.file_name();
        let filepath = entry.path();
        if ignore.contains(&filename.to_str().unwrap()) {
            continue;
        }
        if filepath.is_dir() {
            let child = get_file_tree(filepath.to_str().unwrap())?;
            tree.children.push(child);
        } else {
            // println!("{}", filepath.to_str().unwrap());
            tree.children.push(FileTree {
                name: filename.to_str().unwrap().to_owned(),
                file_type: FileType::File,
                children: vec![],
                abspath: Some(filepath.to_str().unwrap().to_owned()),
            });
        }
    }
    Ok(tree)
}
