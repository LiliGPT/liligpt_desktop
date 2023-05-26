use super::manager;

pub fn add_project_from_path(path: &str) -> () {
    let connection = manager::get_connection();
    let qry_add_project = "INSERT INTO projects (path) VALUES (?)";
    let mut statement = connection.prepare(qry_add_project).unwrap();
    statement.bind((1, path)).unwrap();

    if let Ok(sqlite::State::Done) = statement.next() {
        println!("Project {} added", path);
    } else {
        println!(
            "Project {} not added, reason: {:#?}",
            path,
            statement.next()
        );
    }
}
