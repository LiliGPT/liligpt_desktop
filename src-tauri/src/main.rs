// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused_must_use)]

mod code_analyst;
mod database;
mod frameworks;
mod io;
mod project;
mod tauri_commands;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {
    database::manager::create_database();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            tauri_commands::open_project::open_project,
            tauri_commands::get_file_tree::get_file_tree,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
