// /routes/mainRoutes.js
// Questo file gestisce le route principali dell'applicazione
const express = require('express');
const router = express.Router();
const BookDAO = require('../dao/book-dao');
const ReviewDAO = require('../dao/review-dao');
const db = require('../config/db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const bookDAO = new BookDAO(db);
const reviewDAO = new ReviewDAO(db);

/**
 * @swagger
 * tags:
 *   name: MainRoutes
 *   description: API for books, reviews, profile, and homepage
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Homepage
 *     tags: [MainRoutes]
 *     description: Shows all books, books of the month and recent reviews
 *     responses:
 *       200:
 *         description: Homepage rendered successfully
 */
router.get('/', async (req, res) => {
    try {
        const botM = await bookDAO.getBooksOfTheMonth();
        const books = await bookDAO.getAllBooks();
        const reviews = await reviewDAO.getRecentReviews(15);
        res.render('index', {   
            books,
            botM,
            reviews,
            user: req.session.user
        });
    } catch (err) {
        console.error('Error loading books:', err);
        req.flash('error_msg', 'Failed to load books.');
        res.redirect('/');
    }
});


/**
 * @swagger
 * /profile:
 *   get:
 *     summary: User profile
 *     tags: [MainRoutes]
 *     description: Displays books added by the logged-in user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile page with user's books
 *       401:
 *         description: Unauthorized - user not logged in
 */
router.get('/profile', isAuthenticated, async (req, res) =>{
    const userId = req.user.id;
    const bookDAO = req.app.locals.bookDAO;
    try {
        const books = await bookDAO.getBooksByUser(userId);
        res.render('profile', { 
            books: books,
             user: req.user });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Loading books failed');
        res.render('profile', { books: [] });
    }
}); 

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Book details
 *     tags: [MainRoutes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the book
 *     responses:
 *       200:
 *         description: Book details page
 *       404:
 *         description: Book not found
 */

router.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        const book = await bookDAO.getBookById(bookId);
        const reviews = await reviewDAO.getReviewsByBookId(bookId);
        if (!book) {
            req.flash('error_msg', 'Book not found');
            return res.redirect('/');
        }
        res.render('book', {
            book,
            reviews,
            user: req.session.user,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error('Error retrieving book or reviews:', err);
        req.flash('error_msg', 'Something went wrong');
        res.redirect('/');
    }
});

/**
 * @swagger
 * /books/delete:
 *   post:
 *     summary: Remove a book from user's library
 *     tags: [MainRoutes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: integer
 *     responses:
 *       302:
 *         description: Redirect to profile page
 */

router.post('/books/delete', isAuthenticated, async (req, res) => {
    const bookId = req.body.bookId;
    const userId = req.session.user.id;
    try {
        await bookDAO.deleteBookFromUserLibrary(userId, bookId);
        req.flash('success_msg', 'Book removed from your library.');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to remove book.');
        res.redirect('/profile');
    }
});


/**
 * @swagger
 * /books/add:
 *   post:
 *     summary: Add a custom book to user's library
 *     tags: [MainRoutes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               description:
 *                 type: string
 *               cover_url:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to profile
 */

router.post('/books/add', isAuthenticated, async (req, res) => {
    const { title, author, genre, description, cover_url } = req.body;
    const addedBy = req.user.id;
    const date = new Date().toISOString();

    try {
        const result = await bookDAO.addBook(title, author, genre, description, cover_url, addedBy);
        const bookId = result.id;
        await bookDAO.insertBookByUser(addedBy, bookId);   
        req.flash('success_msg', 'Book added successfully!');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error while adding book.');
        res.redirect('/profile');
    }
});

/**
 * @swagger
 * /library/add:
 *   post:
 *     summary: Add a Book of the Month to user's library
 *     tags: [MainRoutes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: integer
 *     responses:
 *       302:
 *         description: Redirect to profile or homepage
 */

router.post('/library/add', isAuthenticated, async (req, res) => {
    let { bookId } = req.body;  
    const userId = req.user.id;
    try {
        const botmBook = await bookDAO.getBookOfTheMonthById(bookId);
        if (!botmBook) {
            req.flash('error_msg', 'Book not found.');
            return res.redirect('/');
        }
        let existingBook = await bookDAO.getBookByTitleAndAuthor(botmBook.title, botmBook.author);
        let newBookId;
        if (existingBook) {
            newBookId = existingBook.id;
        } else {
            const inserted = await bookDAO.addBook(
                botmBook.title,
                botmBook.author,
                botmBook.genre,
                botmBook.description,
                botmBook.cover_url,
                null
            );
            newBookId = inserted.id;
        }
        const alreadyAdded = await bookDAO.getBookAddedByUser(newBookId, userId);
        if (alreadyAdded) {
            req.flash('error_msg', 'This book is already in your library.');
            return res.redirect('/');
        }
        await bookDAO.insertBookByUser(userId, newBookId);
        req.flash('success_msg', 'Book added into your library!');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to add book into your library.');
        res.redirect('/');
    }
});

/**
 * @swagger
 * /booksOfTheMonth/add:
 *   post:
 *     summary: Admin - Add Book of the Month
 *     tags: [MainRoutes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               description:
 *                 type: string
 *               cover_url:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect after adding book
 */

router.post('/booksOfTheMonth/add', isAdmin, async (req, res) => {
    const { title, author, genre, description, cover_url } = req.body;

    try {
        let book = await bookDAO.getBookByTitleAndAuthor(title, author);
        let bookId;

        if (book) {
            bookId = book.id;
        } else {
            const result = await bookDAO.addBook(title, author, genre, description, cover_url);
            bookId = result.id;
        }

        try {
            await bookDAO.addBookByAdmin(bookId);
            req.flash('success_msg', 'Book of the Month added successfully!');
        } catch (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                req.flash('error_msg', 'Book of The Month already exists.');
            } else {
                throw err;
            }
        }

        res.redirect('/profile');
    } catch (err) {
        console.error('Unexpected error:', err);
        req.flash('error_msg', 'Error while adding new Book of the Month');
        res.redirect('/profile');
    }
});

/**
 * @swagger
 * /booksOfTheMonth/delete:
 *   post:
 *     summary: Admin - Remove Book of the Month
 *     tags: [MainRoutes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: integer
 *     responses:
 *       302:
 *         description: Redirect after deletion
 */
router.post('/booksOfTheMonth/delete', isAdmin, async (req, res) => {
    const bookId = parseInt(req.body.bookId);
    try {
        
        await bookDAO.deleteBookAdmin(bookId);
        req.flash('success_msg', 'Book of the Month removed successfully.');
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting book:', err);
        req.flash('error_msg', 'Error occurred while deleting book.');
        res.redirect('/');
    }
});

/**
 * @swagger
 * /books/review:
 *   post:
 *     summary: Add a review to a book
 *     tags: [MainRoutes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *               book_id:
 *                 type: integer
 *     responses:
 *       302:
 *         description: Redirect back to book detail
 */

router.post('/books/review', isAuthenticated, async( req, res) => {
    const { content, rating, book_id } = req.body;
    const userId = req.user.id;

    try {
        await reviewDAO.addReview(userId, book_id, content, rating);
        req.flash('success_msg', 'Review added!');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error while adding review.');
    }
    res.redirect(`/books/${book_id}`);
});

/**
 * @swagger
 * /reviews/delete:
 *   post:
 *     summary: Admin - Delete a review
 *     tags: [MainRoutes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: integer
 *     responses:
 *       302:
 *         description: Redirect to homepage after deletion
 */

router.post('/reviews/delete', isAdmin, async (req, res) => {
  const { reviewId } = req.body;
  try {
    await reviewDAO.deleteReview(reviewId);
    req.flash('success_msg', 'Review deleted');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Could not delete review');
    res.redirect('/');
  }
}); 

// Pagina statica About
router.get('/about', (req, res) => {
  res.render('about', { user: req.session.user });
});



module.exports = router;
