pub fn get_connection() -> sqlite::Connection {
    let connection = sqlite::open("/tmp/deleteme.db").unwrap();
    connection
}

pub fn create_database() -> () {
    let _should_drop = false;
    let mut query = String::from("");
    if _should_drop {
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
