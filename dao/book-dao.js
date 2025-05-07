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

    insertBookByUser(userId, bookId) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO user_books (user_id, book_id) VALUES (?, ?)`;
            this.db.run(sql, [userId, bookId], function(err) {
                if (err) return reject(err);
                resolve({ id: this.lastID });
            });
        });
    }

    /*insertBookByAdmin(userId, bookId){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO booksOfTheMonth'
        });
    }*/

    getAllBooks() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM books';
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    getBooksOfTheMonth() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM booksOfTheMonth';
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    getBookOfTheMonthById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM booksOfTheMonth WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
    
    getBookByTitleAndAuthor(title, author) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM books WHERE title = ? AND author = ?';
            this.db.get(sql, [title, author], (err, row) => {
                if (err) return reject(err);
                resolve(row);
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

    getBookAddedByUser(bookId, userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM user_books WHERE user_id = ? AND book_id = ?';
            this.db.get(sql, [userId, bookId], (err, row) => {
                if(err) return reject(err);
                resolve(row)
            });
        });
    }

    getBooksByUser(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT DISTINCT books.*
                FROM books
                LEFT JOIN user_books ON books.id = user_books.book_id
                WHERE user_books.user_id = ?
                   OR books.added_by = ?
            `;
            this.db.all(sql, [userId, userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
    

    // For search API
    searchBooks(title) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT title, author, genre, description, cover_url FROM booksOfTheMonth
                WHERE title LIKE ?
                UNION
                SELECT title, author, genre, description, cover_url FROM books
                WHERE title LIKE ?
            `;
            this.db.all(sql, [`%${title}%`, `%${title}%`], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
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

    deleteBookAdmin(id) {
        return new Promise((resolve, reject) => {
            const sqlDeleteFromBooksOfTheMonth = 'DELETE FROM booksOfTheMonth WHERE id = ?';
            this.db.run(sqlDeleteFromBooksOfTheMonth, [id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }


}

module.exports = BookDAO;