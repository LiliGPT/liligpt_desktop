pub mod context_files;
pub mod types;
use super::code_analyst::{self, types::PathInfo};
pub use types::{PrompterRequest, PrompterResponse, PrompterResponseActionType};

impl PathInfo {
    fn get_file_content(cwd: &str, path: &str) -> Option<String> {
        let full_path = format!("{}/{}", cwd, path);
        let file_content = std::fs::read_to_string(full_path);
        match file_content {
            Ok(content) => Some(content),
            Err(_) => None,
        }
    }

    pub async fn get_prompter_request_files(
        &self,
        message: &str,
    ) -> Result<types::PrompterRequestFiles, String> {
        // let cwd = &self.project_dir;
        let request_files = types::RelevantFilesRequest::new(self, message);
        let request_files = request_files.fetch_relevant_files().await?.files;
        // let request_files = match self.framework {
        //     Framework::NodeNest => {
        //         vec![
        //             PrompterRequestFile {
        //                 path: "src/main.ts".to_string(),
        //                 content: Self::get_file_content(cwd, "src/main.ts"),
        //             },
        //             PrompterRequestFile {
        //                 path: "src/app.module.ts".to_string(),
        //                 content: Self::get_file_content(cwd, "src/app.module.ts"),
        //             },
        //             PrompterRequestFile {
        //                 path: "src/app.controller.ts".to_string(),
        //                 content: None,
        //             },
        //             PrompterRequestFile {
        //                 path: "src/app.service.ts".to_string(),
        //                 content: None,
        //             },
        //             PrompterRequestFile {
        //                 path: "src/example/example.module.ts".to_string(),
        //                 content: None,
        //             },
        //             PrompterRequestFile {
        //                 path: "src/example/example.controller.ts".to_string(),
        //                 content: None,
        //             },
        //             PrompterRequestFile {
        //                 path: "src/example/example.service.ts".to_string(),
        //                 content: None,
        //             },
        //         ]
        //     }
        //     _ => vec![],
        // };
        let relevant_files: Vec<types::PrompterRequestFile> = request_files
            .iter()
            .map(|file| types::PrompterRequestFile {
                path: file.path.clone(),
                content: Self::get_file_content(&self.project_dir, &file.path),
            })
            .collect();
        let context_files = match self.framework {
            code_analyst::types::Framework::NodeNest => {
                let mut context_files = relevant_files;
                if !context_files.iter().any(|file| file.path == "src/main.ts") {
                    context_files.push(types::PrompterRequestFile {
                        path: "src/main.ts".to_string(),
                        content: Self::get_file_content(&self.project_dir, "src/main.ts"),
                    });
                }
                if !context_files
                    .iter()
                    .any(|file| file.path == "src/app.module.ts")
                {
                    context_files.push(types::PrompterRequestFile {
                        path: "src/app.module.ts".to_string(),
                        content: Self::get_file_content(&self.project_dir, "src/app.module.ts"),
                    });
                }
                if !context_files
                    .iter()
                    .any(|file| file.path == "src/app.controller.ts")
                {
                    context_files.push(types::PrompterRequestFile {
                        path: "src/app.controller.ts".to_string(),
                        content: None,
                    });
                }
                context_files
            }
            _ => relevant_files,
        };
        return Ok(types::PrompterRequestFiles {
            can_create: true,
            can_read: true,
            context: context_files,
        });
    }
}

impl types::PrompterResponse {
    pub async fn find_by_prompt_id(prompt_id: &str) -> Result<types::PrompterResponse, String> {
        let http_client = reqwest::Client::new();
        let response = http_client
            .get(&format!("{}/prompt/{}", dotenv!("PROMPTER_URL"), prompt_id))
            .send()
            .await;
        let response = match response {
            Ok(response) => response,
            Err(_) => return Err("Failed to connect to prompter".to_string()),
        };
        let response_text = response.text().await.unwrap_or_default();
        if response_text.is_empty() {
            return Err("Prompter response is empty".to_string());
        }
        let response = match serde_json::from_str::<types::PrompterResponse>(&response_text) {
            Ok(response) => response,
            Err(error) => {
                return Err(format!(
                    "Failed to parse prompter response:\n\n{}\n\n{}",
                    error, response_text
                ))
            }
        };
        Ok(response)
    }
}
