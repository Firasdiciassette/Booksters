    //dao/session-dao.js
/**
 * Classe per la gestione delle sessioni utente nel database SQLite.
 * Viene utilizzata da librerie come express-session per memorizzare lo stato delle sessioni.
 */
class SessionDAO {
    /**
     * Costruttore della classe SessionDAO.
     * Inizializza la connessione e crea la tabella se non esiste.
     * @param {sqlite3.Database} db - Connessione al database SQLite.
     */
    constructor(db) {
        this.db = db;
        this.createTable();
    }
    /**
     * Crea la tabella 'sessions' se non esiste già.
     * La tabella contiene l'ID della sessione, il contenuto e la data di scadenza.
     */
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
            callback(null, JSON.parse(row.sess));
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

module.exports = SessionDAO;
