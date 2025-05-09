const sqlite3 = require('sqlite3').verbose();

class ReviewDAO {
    constructor(db){
        this.db = db;
    }

    addReview(userId, bookId, content, rating) {
        return new Promise((resolve, reject) => {
            //console.log('book_id received in dao: ', bookId);
            const sql = 'INSERT INTO reviews (user_id, book_id, content, rating) values (?, ?, ?, ?)';
            this.db.run(sql, [userId, bookId, content, rating], function(err){
                if(err) reject(err);
                resolve({ id: this.lastId});
            });
        });
    }

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

    getRecentReviews(limit = 5) {
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