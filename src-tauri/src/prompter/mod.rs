#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterRequest {
    pub message: String,
    pub code_language: super::code_analyst::types::CodeLanguage,
    pub framework: super::code_analyst::types::Framework,
    pub files: PrompterRequestFiles,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterResponse {
    pub prompt_id: String,
    pub status: PrompterResponseStatus,
    pub actions: Vec<PrompterResponseAction>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterResponseAction {
    pub action_type: PrompterResponseActionType,
    pub content: String,
    pub path: String,
}

#[derive(strum::Display, serde::Serialize, serde::Deserialize)]
pub enum PrompterResponseStatus {
    InProgress,
    Ok,
    Fail,
    NeedsRetry,
}

#[derive(strum::Display, serde::Serialize, serde::Deserialize)]
pub enum PrompterResponseActionType {
    #[serde(rename = "create_file")]
    CreateFile,
    #[serde(rename = "update_file")]
    UpdateFile,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterRequestFiles {
    pub can_create: bool,
    pub can_read: bool,
    pub context: Vec<PrompterRequestFile>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterRequestFile {
    pub path: String,
    pub content: Option<String>,
}

use super::code_analyst::types::{Framework, PathInfo};

impl PathInfo {
    fn get_file_content(cwd: &str, path: &str) -> Option<String> {
        let full_path = format!("{}/{}", cwd, path);
        let file_content = std::fs::read_to_string(full_path);
        match file_content {
            Ok(content) => Some(content),
            Err(_) => None,
        }
    }

    pub fn get_prompter_request_files(&self) -> PrompterRequestFiles {
        let cwd = &self.project_dir;
        let request_files = match self.framework {
            Framework::NodeNest => {
                vec![
                    PrompterRequestFile {
                        path: "src/main.ts".to_string(),
                        content: Self::get_file_content(cwd, "src/main.ts"),
                    },
                    PrompterRequestFile {
                        path: "src/app.module.ts".to_string(),
                        content: Self::get_file_content(cwd, "src/app.module.ts"),
                    },
                    PrompterRequestFile {
                        path: "src/app.controller.ts".to_string(),
                        content: None,
                    },
                    PrompterRequestFile {
                        path: "src/app.service.ts".to_string(),
                        content: None,
                    },
                    PrompterRequestFile {
                        path: "src/example/example.module.ts".to_string(),
                        content: None,
                    },
                    PrompterRequestFile {
                        path: "src/example/example.controller.ts".to_string(),
                        content: None,
                    },
                    PrompterRequestFile {
                        path: "src/example/example.service.ts".to_string(),
                        content: None,
                    },
                ]
            }
            _ => vec![],
        };
        return PrompterRequestFiles {
            can_create: true,
            can_read: true,
            context: request_files,
        };
    }
}

impl PrompterResponse {
    pub async fn find_by_prompt_id(prompt_id: &str) -> Result<PrompterResponse, String> {
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
        let response = match serde_json::from_str::<PrompterResponse>(&response_text) {
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
