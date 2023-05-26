use std::sync::Mutex;

pub fn get_connection() -> sqlite::Connection {
    let connection = sqlite::open("/tmp/deleteme.db").unwrap();
    connection
}

pub fn create_database() -> () {
    let SHOULD_DROP = false;
    let mut query = String::from("");
    if SHOULD_DROP {
        println!("[!] Dropping database...");
        query += "DROP TABLE IF EXISTS projects;";
    }
    query += "
      CREATE TABLE if not exists projects (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL);
    ";
    let connection = get_connection();
    let mut statement = connection.prepare(query).unwrap();
    statement.next().unwrap();
    println!("Database created");
}
