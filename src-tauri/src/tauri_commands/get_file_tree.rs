#[tauri::command]
pub async fn get_file_tree(project_dir: String) -> Result<impl serde::Serialize, String> {
    let tree = crate::io::tree::get_file_tree(&project_dir).expect("error getting file tree");
    // if tree.is_err() {
    //     return Err(tree.unwrap_err());
    // }
    // let tree = serde_json::to_string(&tree);
    // if tree.is_err() {
    //     return Err(tree.err().unwrap().to_string());
    // }
    // let tree = tree.unwrap();
    return Ok(tree);
}
