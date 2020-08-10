const Database = require('sqlite-async')

// função que executa logo depois do banco de dados ser criado
function execute(db) {
    // (O banco de dados) é um objeto também
    // criar as tabelas do banco de dados
    return db.exec(`
        CREATE TABLE IF NOT EXISTS proffys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            avatar TEXT,
            whatsapp TEXT,
            bio TEXT
        );

        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject INTEGER,
            cost TEXT,
            proffy_id INTEGER
        );

        CREATE TABLE IF NOT EXISTS class_schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER,
            weekday INTEGER,
            time_from INTEGER,
            time_to INTEGER
        );
    `)
}

// Essa funcionalidade fará com que execute o resto do código somente depois que o banco de dados estiver criado
module.exports = Database.open(__dirname + "/database.sqlite").then(execute)
