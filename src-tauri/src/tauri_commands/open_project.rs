#[tauri::command]
pub async fn open_project() -> Result<impl serde::Serialize, String> {
    // get project_dir as string
    let project_dir = tauri::api::dialog::blocking::FileDialogBuilder::new().pick_folder();
    if project_dir.is_none() {
        return Err("no project selected".to_string());
    }
    let project_dir = project_dir.unwrap().to_str().unwrap().to_owned();
    // return project_dir as json
    // let project = crate::project::Project::new_from_directory(&project_dir).await;
    // Ok(project.to_json()?)
    let path_info = crate::code_analyst::get_path_info(&project_dir)?;
    Ok(path_info)
}
