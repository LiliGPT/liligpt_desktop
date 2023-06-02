#[tauri::command]
pub async fn open_project(path: String) -> Result<impl serde::Serialize, String> {
    // get project_dir as string
    let project_dir: String = match path {
        // if path is empty, open file dialog
        path if path.is_empty() => {
            let picked_folder =
                tauri::api::dialog::blocking::FileDialogBuilder::new().pick_folder();
            if picked_folder.is_none() {
                return Err("no project selected".to_string());
            }
            picked_folder.unwrap().to_str().unwrap().to_owned()
        }
        _ => path,
    };
    // return project_dir as json
    // let project = crate::project::Project::new_from_directory(&project_dir).await;
    // Ok(project.to_json()?)
    let path_info = crate::code_analyst::get_path_info(&project_dir)?;
    Ok(path_info)
}
