use super::super::code_analyst;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterRequest {
    pub prompt_request_id: String,
    pub message: String,
    pub code_language: code_analyst::types::CodeLanguage,
    pub framework: code_analyst::types::Framework,
    pub files: PrompterRequestFiles,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterResponse {
    pub prompt_id: String,
    pub message: String,
    pub status: PrompterResponseStatus,
    pub actions: Vec<PrompterResponseAction>,
    pub original_actions: Vec<PrompterResponseAction>,
    pub created_at: String,
    pub updated_at: Option<String>,
}

#[derive(Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct PrompterResponseAction {
    pub action_type: PrompterResponseActionType,
    pub content: String,
    pub path: String,
}

#[derive(strum::Display, serde::Serialize, serde::Deserialize)]
pub enum PrompterResponseStatus {
    InProgress,
    Approved,
    Ok,
    Fail,
}

#[derive(Debug, PartialEq, strum::Display, serde::Serialize, serde::Deserialize)]
pub enum PrompterResponseActionType {
    #[serde(rename = "create_file")]
    CreateFile,
    #[serde(rename = "update_file")]
    UpdateFile,
    #[serde(rename = "delete_file")]
    DeleteFile,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterRequestFiles {
    pub can_create: bool,
    pub can_read: bool,
    pub project_tips: String,
    pub context: Vec<PrompterRequestFile>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterRequestFile {
    pub path: String,
    pub content: Option<String>,
}

///////////////////////////////////////////////////////////////////////////////////////////
/// context_files

#[derive(serde::Deserialize, serde::Serialize)]
pub struct RelevantFilesRequest {
    pub message: String,
    pub files: Vec<String>,
    pub code_language: code_analyst::types::CodeLanguage,
    pub framework: code_analyst::types::Framework,
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct RelevantFilesResponse {
    pub prompt_request_id: String,
    pub project_tips: String,
    pub files: Vec<RelevantFile>,
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct RelevantFile {
    pub path: String,
    pub wc: bool, // wc = "with content?"
}
