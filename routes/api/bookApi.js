const express = require('express');
const router = express.Router();
const BookDAO = require('../dao/book-dao.js');
const db = require ('../../config/db.js');

const bookDAO = new BookDAO(db);


router.get('/books', async (req, res) => {
    const { title, author, genre } = req.query;

    try {
        const books = await bookDAO.searchBooks({ title, author, genre });
        res.json(query);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nothing here... '});
    }
});

module.exports = router;
