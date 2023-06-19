// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused_must_use)]

mod auth;
mod code_analyst;
mod code_missions_api;
mod configjson;
mod database;
mod git_repo;
mod io;
mod prompter;
mod shell;
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
            // tauri_commands::rust_prompt_prepare::rust_prompt_prepare,
            // tauri_commands::rust_prompt_create::rust_prompt_create,
            // tauri_commands::rust_prompt_delete::rust_prompt_delete,
            // tauri_commands::rust_prompt_set_ok::rust_prompt_set_ok,
            tauri_commands::rust_prompt_approve_and_run::rust_prompt_approve_and_run,
            tauri_commands::rust_prompt_submit_review::rust_prompt_submit_review,
            tauri_commands::fetch_missions::fetch_missions,
            tauri_commands::rust_prompt_replace_actions::rust_prompt_replace_actions,
            tauri_commands::create_mission::create_mission_command,
            tauri_commands::search_executions::search_executions_command,
            tauri_commands::review_actions::review_actions_command,
            tauri_commands::set_approved::set_approved_command,
            tauri_commands::set_fail::set_fail_command,
            tauri_commands::set_perfect::set_perfect_command,
            tauri_commands::add_context_files::add_context_files_command,
            tauri_commands::retry_execution::retry_execution_command,
            tauri_commands::auth_login::auth_login_command,
            tauri_commands::auth_refresh_token::auth_refresh_token_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
