    const express = require('express');
    const router = express.Router();
    const BookDAO = require('../../dao/book-dao.js');
    const db = require ('../../config/db.js');
    const bookDAO = new BookDAO(db);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Search books by title
 *     tags: [Books]
 *     description: Returns a list of books matching the given title (partial match).
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Title (or partial title) of the book to search for
 *     responses:
 *       200:
 *         description: List of matching books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   genre:
 *                     type: string
 *                   description:
 *                     type: string
 *                   cover_url:
 *                     type: string
 *       500:
 *         description: Internal server error while searching books
 */
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
