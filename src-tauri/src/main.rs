// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused_must_use)]

mod code_analyst;
mod database;
mod io;
mod prompter;
mod tauri_commands;
mod utils;

#[macro_use]
extern crate dotenv_codegen;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {
    dotenv::dotenv().expect("Failed to load .env file");
    database::manager::create_database();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            tauri_commands::get_file_tree::get_file_tree,
            tauri_commands::get_test_scripts::get_test_scripts,
            tauri_commands::open_project::open_project,
            tauri_commands::run_shell_command::run_shell_command,
            tauri_commands::install_dependencies::install_dependencies,
            tauri_commands::rust_prompt_prepare::rust_prompt_prepare,
            tauri_commands::rust_prompt_create::rust_prompt_create,
            tauri_commands::rust_prompt_delete::rust_prompt_delete,
            tauri_commands::rust_prompt_approve_and_run::rust_prompt_approve_and_run,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
