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
