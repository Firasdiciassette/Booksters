class SessionDAO {
    constructor(db) {
        this.db = db; // Use the provsided database instance
        console.log("Initializing SessionDAO");
        this.createTable();
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS sessions (
            sid TEXT PRIMARY KEY,
            sess TEXT NOT NULL,
            expired INTEGER NOT NULL
        )`;
        this.db.run(sql, (err) => {
            if (err) {
                console.error("Error creating sessions table:", err.message);
            }
        });
    }

    getSession(sid, callback) {
        const sql = `SELECT sess FROM sessions WHERE sid = ?`;
        this.db.get(sql, [sid], (err, row) => {
            if (err) {
                return callback(err);
            }
            if (!row) {
                return callback(null, null);
            }
            callback(null, JSON.parse(row.sess)); // Parse JSON string back to object
        });
    }

    saveSession(sid, sess, expired, callback) {
        const sql = `INSERT INTO sessions (sid, sess, expired) VALUES (?, ?, ?)
                     ON CONFLICT(sid) DO UPDATE SET sess = ?, expired = ?`;
        this.db.run(sql, [sid, JSON.stringify(sess), expired, JSON.stringify(sess), expired], callback);
    }

    deleteSession(sid, callback) {
        const sql = `DELETE FROM sessions WHERE sid = ?`;
        this.db.run(sql, [sid], callback);
    }
}

module.exports = SessionDAO; // Ensure you're exporting the class
