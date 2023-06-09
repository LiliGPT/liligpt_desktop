use super::PrompterResponse;

pub async fn fetch_missions() -> Result<Vec<PrompterResponse>, String> {
    let client = reqwest::Client::new();
    let missions = client
        .get(format!("{}/prompts", dotenv!("PROMPTER_URL")).as_str())
        .send()
        .await
        .map_err(|err| format!("Failed to fetch missions: {}", err))?
        .json::<Vec<PrompterResponse>>()
        .await
        .map_err(|err| format!("Failed to fetch missions: {}", err))?;
    Ok(missions)
}
