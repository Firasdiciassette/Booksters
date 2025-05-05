// /dao/user-dao.js
const sqlite3 = require('sqlite3').verbose();

class UserDAO {
  constructor(db) {
    this.db = db;
  }

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

  findUserByEmail(email){
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      this.db.get(sql, [email], (err, row) => {
        if(err) return reject (err);
        resolve(row);
      });
    });
  }

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
