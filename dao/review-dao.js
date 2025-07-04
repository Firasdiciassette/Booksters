const sqlite3 = require('sqlite3').verbose();
/**
 * Classe che gestisce le operazioni relative alle recensioni nel database.
 */
class ReviewDAO {
    constructor(db){
        this.db = db;
    }
    /**
     * Aggiunge una recensione per un determinato libro da parte di un utente.
     * @param {number} userId - ID dell'utente che scrive la recensione.
     * @param {number} bookId - ID del libro recensito.
     * @param {string} content - Contenuto della recensione.
     * @param {number} rating - Voto da 1 a 5.
     * @returns {Promise<Object>} - Oggetto con l'ID della recensione inserita.
     *
     * */
    addReview(userId, bookId, content, rating) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO reviews (user_id, book_id, content, rating) values (?, ?, ?, ?)';
            this.db.run(sql, [userId, bookId, content, rating], function(err){
                if(err) reject(err);
                resolve({ id: this.lastID});
            });
        });
    }
    /**
     * Recupera tutte le recensioni di un libro, ordinate dalla più recente.
     * @param {number} bookId - ID del libro.
     * @returns {Promise<Array>} - Lista di recensioni con anche il nome utente.
     */
    getReviewsByBookId(bookId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT reviews.*, users.username
                FROM reviews
                JOIN users ON reviews.user_id = users.id
                WHERE reviews.book_id = ?
                ORDER BY reviews.created_at DESC
            `;
            this.db.all(sql, [bookId], (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            });
        });
    }
    /**
     * Recupera le recensioni più recenti (default 15).
     * Include informazioni sul libro e sull'utente.
     * @param {number} [limit=15] - Numero massimo di recensioni da recuperare.
     * @returns {Promise<Array>} - Lista di recensioni recenti.
     */
    getRecentReviews(limit = 15) {
        return new Promise((resolve, reject) => {
          const sql = `
            SELECT 
              reviews.*, 
              users.username, 
              books.title AS book_title, 
              books.id AS book_id,
              books.cover_url AS book_cover,
              books.author AS book_author
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            JOIN books ON reviews.book_id = books.id
            LIMIT ?
          `;
          this.db.all(sql, [limit], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          });
        });
      }      
}

module.exports = ReviewDAO;