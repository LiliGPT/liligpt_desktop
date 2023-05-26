// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused_must_use)]

mod database;
mod nestjs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn open_project() -> Result<String, String> {
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

fn main() {
    database::manager::create_database();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_project])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
