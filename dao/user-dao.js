// /dao/user-dao.js
/**
 * Classe per la gestione degli utenti nel database.
 * Contiene metodi per creare, cercare e contare gli utenti.
 */
const sqlite3 = require('sqlite3').verbose();
/**
   * Costruttore della classe UserDAO.
   * @param {sqlite3.Database} db - Connessione al database SQLite.
   */
class UserDAO {
  constructor(db) {
    this.db = db;
  }
  /**
   * Crea un nuovo utente nel database.
   * @param {string} username - Nome utente.
   * @param {string} email - Email dell’utente.
   * @param {string} password - Password (hashata).
   * @param {string} role - Ruolo dell’utente (es. 'user' o 'admin').
   * @returns {Promise<number>} - ID dell’utente appena creato.
   */  
  createUser(username, email, password, role) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
      this.db.run(sql, [username, email, password, role], function(err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      });
    });
  }
   /**
   * Cerca un utente usando lo username.
   * @param {string} username - Username da cercare.
   * @returns {Promise<Object|null>} - Dati dell’utente o null se non trovato.
   */
  findUserByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
      this.db.get(sql, [username], (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }
  /**
   * Cerca un utente per email.
   * @param {string} email - Email da cercare.
   * @returns {Promise<Object|null>} - Dati dell’utente o null se non trovato.
   */
  findUserByEmail(email){
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      this.db.get(sql, [email], (err, row) => {
        if(err) return reject (err);
        resolve(row);
      });
    });
  }
  /**
   * Cerca un utente per ID.
   * @param {number} id - ID dell’utente.
   * @returns {Promise<Object|null>} - Oggetto utente o null se non esiste.
   */
  findUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

   /**
   * Restituisce il numero totale di utenti.
   * @returns {Promise<number>} - Totale utenti registrati.
   */
  getUserCount() {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT COUNT(*) AS countUsers FROM users", (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row?.countUsers || 0);
      });
    });
  }
}
module.exports = UserDAO;
