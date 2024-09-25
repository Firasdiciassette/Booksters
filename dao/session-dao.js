const sqlite3 = require('sqlite3').verbose;

class SessionDAO{
    constructor(db){
        this.db=db;
        this.createTable();
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            session TEXT NOT NULL,
            expires INTEGER NOT NULL
        )`;
        this.db.run(sql);
    }

    getSession(id, callback){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT session FROM sessions WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if(err){
                    return reject(err);
                }
                resolve(row);
            });
        });
    }
}

module.exports = SessionDAO;