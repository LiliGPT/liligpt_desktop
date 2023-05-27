#[tauri::command]
pub async fn open_project() -> Result<String, String> {
    // get project_dir as string
    let project_dir = tauri::api::dialog::blocking::FileDialogBuilder::new().pick_folder();
    if project_dir.is_none() {
        return Err("no project selected".to_string());
    }
    let project_dir = project_dir.unwrap().to_str().unwrap().to_owned();
    // check if project is valid
    let is_valid_project = crate::frameworks::nestjs::validator::is_valid_project(&project_dir);
    if is_valid_project.is_err() {
        return Err(is_valid_project.err().unwrap().to_string());
    }
    // add project to database
    crate::database::projects::add_project_from_path(&project_dir);
    // return project_dir
    return Ok(project_dir);
}
