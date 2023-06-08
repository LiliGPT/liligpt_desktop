use super::super::code_analyst;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PrompterRequest {
    pub message: String,
    pub code_language: code_analyst::types::CodeLanguage,
    pub framework: code_analyst::types::Framework,
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
    pub files: Vec<RelevantFile>,
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct RelevantFile {
    pub path: String,
}
