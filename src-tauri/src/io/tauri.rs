use crate::{database, nestjs};

#[tauri::command]
pub async fn open_project() -> Result<String, String> {
    let project_dir = tauri::api::dialog::blocking::FileDialogBuilder::new().pick_folder();
    if project_dir.is_none() {
        return Err("no project selected".to_string());
    }
    let project_dir = project_dir.unwrap().to_str().unwrap().to_owned();
    let is_valid_project = nestjs::validator::is_valid_project(&project_dir);
    if is_valid_project.is_err() {
        return Err(is_valid_project.err().unwrap().to_string());
    } else {
        database::projects::add_project_from_path(&project_dir);
        return Ok(project_dir);
    }
}

#[tauri::command]
pub async fn get_file_tree(path: String) -> Result<impl serde::Serialize, String> {
    let tree = crate::io::tree::get_file_tree(&path);
    if tree.is_err() {
        return Err(tree.err().unwrap().to_string());
    }
    let tree = tree.unwrap();
    // let tree = serde_json::to_string(&tree);
    // if tree.is_err() {
    //     return Err(tree.err().unwrap().to_string());
    // }
    // let tree = tree.unwrap();
    return Ok(tree);
}
