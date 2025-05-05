const sqlite3 = require('sqlite3').verbose();

class BookDAO {
    constructor(db){
        this.db = db;
    }

    /*createBooks() {   
        return new Promise((resolve, reject) => {
            const sql = `
                CREATE TABLE IF NOT EXISTS books (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    genre TEXT,
                    description TEXT,
                    cover_url TEXT,
                    added_by INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (added_by) REFERENCES users(id)
                )
            `;
            this.db.run(sql, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }*/


    addBook(title, author, genre, description, coverUrl, addedBy) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO books (title, author, genre, description, cover_url, added_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const bookParams = [title, author, genre, description, coverUrl, addedBy];

            this.db.run(sql, bookParams, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve({id: this.lastID}); 
            });
        });
    }

    getAllBooks() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM books';
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    getBookById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM books WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getBooksByUser(userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM books WHERE added_by = ?';
            this.db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
}

deleteBook(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM books WHERE id = ?';
        this.db.run(sql, [id], function(err) {
            if (err) return reject(err);
            resolve();
        });
    });
}


module.exports = BookDAO;