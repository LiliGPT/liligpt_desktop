#[tauri::command]
pub async fn open_project() -> Result<impl serde::Serialize, String> {
    // get project_dir as string
    let project_dir = tauri::api::dialog::blocking::FileDialogBuilder::new().pick_folder();
    if project_dir.is_none() {
        return Err("no project selected".to_string());
    }
    let project_dir = project_dir.unwrap().to_str().unwrap().to_owned();
    // detect language, framework and other infos about the project_dir
    let project = crate::project::Project::new_from_directory(&project_dir).await;
    // check if project is valid
    // if initial_analysis.is_valid_project() == false {
    //     return Err(initial_analysis.get_error_message());
    // }
    // -- old code to delete --
    // let is_valid_project = crate::frameworks::nestjs::validator::is_valid_project(&project_dir);
    // if is_valid_project.is_err() {
    //     return Err(is_valid_project.err().unwrap().to_string());
    // }
    // ------------------------
    // build a project from this analysis
    // ? should i save to database?
    // -- old code to delete --
    // add project to database
    // crate::database::projects::add_project_from_path(&project_dir);
    // return project_dir
    // ------------------------
    Ok(project.to_json()?)
}
