use crate::configjson;

pub fn get_access_token() -> Option<String> {
    let access_token = configjson::get("access_token");
    access_token
}
