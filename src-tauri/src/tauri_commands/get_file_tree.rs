#[tauri::command]
pub async fn get_file_tree(project_dir: String) -> Result<impl serde::Serialize, String> {
    // let tree = crate::io::tree::get_file_tree(&project_dir).expect("error getting file tree");
    // return Ok(tree);
    Ok("".to_string())
}
