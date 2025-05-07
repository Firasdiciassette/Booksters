const express = require('express');
const router = express.Router();
const BookDAO = require('../../dao/book-dao.js');
const db = require ('../../config/db.js');

const bookDAO = new BookDAO(db);
// GET /api/books?title=...

router.get('/books', async (req, res) => {
    const { title } = req.query;

    try {
        const books = await bookDAO.searchBooks(title);
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error while searching books.'});
    }
});

module.exports = router;
